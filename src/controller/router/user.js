import { Router } from 'express';
import httpStatus from 'http-status';
import User from '../../data/model/user';

const router = new Router();

router.param('username', (req, res, next, username) => {
  if (res.locals.auth.sub === username || res.locals.auth.isAdmin) {
    next();
  } else {
    res.sendStatus(httpStatus.NOT_FOUND);
  }
});

router.get('/:username', (req, res, next) => {
  User.findOne({ username: req.params.username }).select(User.publicProjection()).exec()
    .then((user) => {
      if (user) {
        res.json(user);
      } else {
        res.sendStatus(httpStatus.NOT_FOUND);
      }
    })
    .catch(err => next(err));
});

router.delete('/:username', (req, res, next) => {
  User.deleteOne({ username: req.params.username }).exec()
    .then(({ nRemoved }) => {
      if (nRemoved === 1) {
        res.sendStatus(httpStatus.OK);
      } else {
        res.sendStatus(httpStatus.NOT_FOUND);
      }
    })
    .catch(err => next(err));
});

router.put('/:username/watched', (req, res, next) => {
  User.updateOne({ username: req.params.username },
    { $push: { seenMovies: { $each: req.body } } }).exec()
    .then((result) => {
      if (result.n === 1 && result.ok === 1 && result.nModified === 1) {
        res.sendStatus(httpStatus.OK);
      } else {
        res.sendStatus(httpStatus.NOT_FOUND);
      }
    })
    .catch(err => next(err));
});

export default router;
