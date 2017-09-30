import jwtExpress from 'express-jwt';
import config from 'config';
import Joi from 'joi';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import ValidationError from '../../error/validation';
import User from '../../data/model/user';
import UnauthorizedError from '../../error/unauthorized';
import { generateRandomId } from '../../util';

export const validateUserToken = jwtExpress({
  secret: config.get('jwt.secret'),
  resultProperty: 'locals.auth' });

export const createUserToken = (req, res, next) => {
  const user = res.locals.user;
  const jwtOptions = {
    expiresIn: config.get('jwt.expiresIn'),
    jwtid: generateRandomId(16),
    subject: user.username,
  };

  res.locals.token = jwt.sign({ isAdmin: user.isAdmin }, config.get('jwt.secret'), jwtOptions);
  return next();
};

export const validateUserPassword = (req, res, next) => {
  const password = res.locals.validatedBody.password;

  bcrypt.compare(password, res.locals.user.passwordHash)
    .then((valid) => {
      if (valid === false) {
        throw new UnauthorizedError('wrong username or password');
      }
      return next();
    })
    .catch(err => next(err));
};

export const hashUserPassword = (req, res, next) => {
  const password = res.locals.validatedBody.password;

  bcrypt.hash(password, config.get('bcrypt.saltRounds'))
    .then((passwordHash) => {
      if (!res.locals.user) {
        res.locals.user = {};
      }

      res.locals.user.passwordHash = passwordHash;
      return next();
    })
    .catch(err => next(err));
};

export const createUser = (req, res, next) => {
  const validatedBody = res.locals.validatedBody;
  const user = {
    username: validatedBody.username,
    email: validatedBody.email,
    ...res.locals.user,
  };

  User.create(user)
    .then((dbUser) => {
      res.locals.user = dbUser;
      return next();
    })
    .catch(err => next(err));
};

export const findUser = (req, res, next) => {
  const username = res.locals.validatedBody.username;

  User.findOne({ username }).exec()
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('wrong username or password');
      }

      res.locals.user = user;
      return next();
    })
    .catch(err => next(err));
};

export const validateLoginUserData = (req, res, next) => {
  const userCredentialSchema = Joi.object().keys({
    username: Joi.string().required(),
    password: Joi.string().required(),
  });

  Joi.validate(req.body, userCredentialSchema, { stripUnknown: true })
    .then((result) => {
      res.locals.validatedBody = result;
      return next();
    })
    .catch(() => next(new ValidationError('validation of user data failed')));
};

export const validateRegisterUserData = (req, res, next) => {
  const userRegistrationSchema = Joi.object().keys({
    username: Joi.string().required(),
    password: Joi.string().required(),
    passwordConfirmation: Joi.string().valid(Joi.ref('password')).required(),
    email: Joi.string().email().required(),
  });

  Joi.validate(req.body, userRegistrationSchema, { stripUnknown: true })
    .then((result) => {
      res.locals.validatedBody = result;
      return next();
    })
    .catch(() => next(new ValidationError('validation of user data failed')));
};
