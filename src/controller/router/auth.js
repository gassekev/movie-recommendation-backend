import { Router } from 'express';
import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';
import Joi from 'joi';
import crypto from 'crypto';
import User from '../../data/model/user';
import { comparePassword, hashPassword } from '../../util';

const tokenExpiresIn = 60 * 60;

const userCredentialSchema = Joi.object().keys({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

const userRegistrationSchema = Joi.object().keys({
  username: Joi.string().required(),
  password: Joi.string().required(),
  passwordConfirmation: Joi.string().valid(Joi.ref('password')).required(),
  email: Joi.string().email().required(),
});

const router = new Router();

router.post('/login', (req, res) => {
  Joi.validate(req.body, userCredentialSchema, { stripUnknown: true })
    .then(credentials => Promise.all([
      User.findOne({ username: credentials.username }).exec(),
      Promise.resolve(credentials),
    ]))
    .catch(() => res.sendStatus(httpStatus.BAD_REQUEST))
    .then(([user, credentials]) => Promise.all([
      Promise.resolve(user),
      comparePassword(credentials.password, user.passwordHash),
    ]))
    .catch(() => res.sendStatus(httpStatus.UNAUTHORIZED))
    .then(([user]) => {
      const jwtOptions = {
        expiresIn: tokenExpiresIn,
        jwtid: crypto.randomBytes(16).toString('hex'),
        subject: user.username,
      };
      const token = jwt.sign({}, process.env.JWT_SECRET, jwtOptions);

      res.json({ token });
    })
    .catch(() => res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR));
});

router.post('/register', (req, res) => {
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
    .catch(() => res.sendStatus(httpStatus.BAD_REQUEST));
});

export default router;
