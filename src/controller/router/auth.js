import { Router } from 'express';
import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';
import Joi from 'joi';
import config from 'config';
import User from '../../data/model/user';
import { validatePassword, hashPassword, generateRandomId } from '../../util';

const router = new Router();

router.post('/login', (req, res, next) => {
  const userCredentialSchema = Joi.object().keys({
    username: Joi.string().required(),
    password: Joi.string().required(),
  });

  Joi.validate(req.body, userCredentialSchema, { stripUnknown: true })
    .then(credentials => Promise.all([
      Promise.resolve(credentials),
      User.findOne({ username: credentials.username }).exec(),
    ]))
    .then(([credentials, user]) => Promise.all([
      Promise.resolve(user),
      validatePassword(credentials.password, user.passwordHash),
    ]))
    .then(([user]) => {
      const jwtOptions = {
        expiresIn: config.get('jwt.expiresIn'),
        jwtid: generateRandomId(16),
        subject: user.username,
      };
      const token = jwt.sign({ isAdmin: user.isAdmin }, config.get('jwt.secret'), jwtOptions);

      res.json({ token });
    })
    .catch(err => next(err));
});

router.post('/register', (req, res, next) => {
  const userRegistrationSchema = Joi.object().keys({
    username: Joi.string().required(),
    password: Joi.string().required(),
    passwordConfirmation: Joi.string().valid(Joi.ref('password')).required(),
    email: Joi.string().email().required(),
  });

  Joi.validate(req.body, userRegistrationSchema, { stripUnknown: true })
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
