import { Router } from 'express';
import httpStatus from 'http-status';
import User from '../../data/model/user';

const router = new Router();

router.param('username', (req, res, next, username) => {
  if (req.auth.sub === username || req.auth.isAdmin) {
    User.findOne({ username }).exec()
      .then((user) => {
        if (user) {
          req.user = user;
          next();
        } else {
          res.sendStatus(httpStatus.NOT_FOUND);
        }
      })
      .catch(() => res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR));
  } else {
    res.sendStatus(httpStatus.UNAUTHORIZED);
  }
});

router.get('/:username', (req, res) => res.json(req.user));

router.delete('/:username', (req, res) => {
  req.user.remove()
    .then((user) => {
      if (user) {
        res.sendStatus(httpStatus.OK);
      } else {
        throw new Error('user not deleted');
      }
    })
    .catch(() => res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR));
});

router.put('/:username/watched', (req, res) => {
  req.user.update({ $push: { seenMovies: { $each: req.body } } }).exec()
    .then((result) => {
      if (result.n === 1 && result.ok === 1 && result.nModified === 1) {
        res.sendStatus(httpStatus.OK);
      } else {
        throw new Error('watched list not updated');
      }
    })
    .catch(() => res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR));
});

export default router;
