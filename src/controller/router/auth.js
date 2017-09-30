import { Router } from 'express';
import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';
import config from 'config';
import User from '../../data/model/user';
import { validatePassword, hashPassword, generateRandomId,
  validateUser, validateLoginUserData, validateRegisterUserData } from '../../util';

const router = new Router();

router.post('/login', (req, res, next) => {
  validateLoginUserData(req.body)
    .then(userData => Promise.all([
      Promise.resolve(userData),
      User.findOne({ username: userData.username }).exec(),
    ]))
    .then(([userData, user]) => Promise.all([
      validateUser(user),
      validatePassword(userData.password, user.passwordHash),
    ]))
    .then(([user, isValidPassword]) => {
      const jwtOptions = {
        expiresIn: config.get('jwt.expiresIn'),
        jwtid: generateRandomId(16),
        subject: user.username,
      };
      const token = jwt.sign({ isAdmin: user.isAdmin }, config.get('jwt.secret'), jwtOptions);

      return res.json({ token });
    })
    .catch(err => next(err));
});

router.post('/register', (req, res, next) => {
  validateRegisterUserData(req.body)
    .then(userData => Promise.all([
      Promise.resolve({
        username: userData.username,
        email: userData.email,
      }),
      hashPassword(userData.password),
    ]))
    .then(([user, passwordHash]) => ({
      ...user,
      passwordHash,
    }))
    .then(user => User.create(user))
    .then(() => res.sendStatus(httpStatus.CREATED))
    .catch(err => next(err));
});

export default router;
