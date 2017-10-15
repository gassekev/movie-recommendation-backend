/**
 * @summary   Router for the users
 * @author    Kevin Gasser, Simon Müller, Tobias Huonder
*/

import { Router } from 'express';
import httpStatus from 'http-status';
import User from '../../data/model/userModel';
import { sanitizeParamUsername } from '../middleware/sanitizeMiddleware';

const router = new Router();

router.use(sanitizeParamUsername);

router.param('username', (req, res, next, username) => {
  if (res.locals.auth.sub === username || res.locals.auth.isAdmin) {
    next();
  } else {
    res.sendStatus(httpStatus.FORBIDDEN);
  }
});

router.get('/', (req, res, next) => {
  if (res.locals.auth.isAdmin) {
    User.find({}).select(User.publicProjection()).exec()
      .then((users) => {
        if (users) {
          res.json(users);
        } else {
          res.sendStatus(httpStatus.NOT_FOUND);
        }
      })
      .catch(err => next(err));
  } else {
    res.sendStatus(httpStatus.FORBIDDEN);
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
  const auth = res.locals.auth;

  if (!(auth.isAdmin && req.params.username === auth.sub)) {
    User.deleteOne({ username: req.params.username }).exec()
      .then(({ deletedCount }) => {
        if (deletedCount === 1) {
          res.sendStatus(httpStatus.OK);
        } else {
          res.sendStatus(httpStatus.NOT_FOUND);
        }
      })
      .catch(err => next(err));
  } else {
    res.sendStatus(httpStatus.FORBIDDEN);
  }
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
