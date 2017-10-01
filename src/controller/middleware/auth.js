import jwtExpress from 'express-jwt';
import config from 'config';
import Joi from 'joi';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import ValidationError from '../../error/validation';
import User from '../../data/model/user';
import AuthError from '../../error/auth';
import { generateRandomId } from '../../util';
import redisClient from '../../data/redis';

const isRevokedCallback = (req, payload, done) => {
  const tokenId = payload.jti;

  if (redisClient.connected) {
    redisClient.exists(tokenId, (err, result) => {
      done(null, !!result);
    });
  } else {
    done(new Error('redis client not connected'));
  }
};

const validateData = (data, schema, next) => {
  Joi.validate(data, schema)
    .then(() => next())
    .catch(() => next(new ValidationError('validation of user data failed')));
};

export const validateUserToken = jwtExpress({
  secret: config.get('jwt.secret'),
  resultProperty: 'locals.auth',
  isRevoked: isRevokedCallback,
});

export const revokeUserToken = (req, res, next) => {
  const auth = res.locals.auth;

  if (redisClient.connected) {
    redisClient.set(auth.jti, '', 'EX', (auth.exp - auth.iat));
    next();
  } else {
    next(new Error('redis client not connected'));
  }
};

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
  const password = req.body.password;

  bcrypt.compare(password, res.locals.user.passwordHash)
    .then((valid) => {
      if (valid === false) {
        throw new AuthError('wrong username or password');
      }
      return next();
    })
    .catch(err => next(err));
};

export const hashUserPassword = (req, res, next) => {
  const password = req.body.password;

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
  const validatedBody = req.body;
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
  const username = req.body.username;

  User.findOne({ username }).exec()
    .then((user) => {
      if (!user) {
        throw new AuthError('wrong username or password');
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

  validateData(req.body, userCredentialSchema, next);
};

export const validateRegisterUserData = (req, res, next) => {
  const userRegistrationSchema = Joi.object().keys({
    username: Joi.string().required(),
    password: Joi.string().required(),
    passwordConfirmation: Joi.string().valid(Joi.ref('password')).required(),
    email: Joi.string().email().required(),
  });

  validateData(req.body, userRegistrationSchema, next);
};
