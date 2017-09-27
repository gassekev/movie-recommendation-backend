import { Router } from 'express';
import httpStatus from 'http-status';
import User from '../../data/model/user';

const router = new Router();

router.get('/recommendations', (req, res) => {
  console.log(req.user.subject);
  User.findOne({ username: req.user.subject }).exec()
    .then(dbUser => res.json(dbUser));
});

router.post('/watched', (req, res) => {
  User.update(
    {},
    { $push: { seenMovies: { $each: req.body } } }).exec()
    .then(() => res.sendStatus(httpStatus.OK))
    .catch(() => res.sendStatus(httpStatus.BAD_REQUEST));
});

export default router;
