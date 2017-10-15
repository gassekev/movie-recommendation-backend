/**
 * @summary   Middleware that handles the authentication
 * @author    Kevin Gasser, Simon Müller, Tobias Huonder
*/

import jwtExpress from 'express-jwt';
import config from 'config';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { uriInDoubleQuotedAttr } from 'xss-filters';
import User from '../../data/model/userModel';
import UnauthorizedError from '../../error/unauthorizedError';
import InternalError from '../../error/internalError';
import { generateRandomId, smtpTransporter } from '../../util';
import redisClient from '../../data/redis';
import { checkUsername,
  checkPassword, checkPasswordConfirmation, checkEmail, checkEmailUnique,
  checkUsernameUnique } from './validationMiddleware';

const isRevokedCallback = (req, payload, done) => {
  const tokenId = payload.jti;

  if (redisClient.connected) {
    redisClient.exists(tokenId, (err, result) => {
      done(null, !!result);
    });
  } else {
    done(new InternalError('redis client not connected'));
  }
};

/** Validates the user token */
export const validateUserToken = jwtExpress({
  secret: config.get('jwt.secret'),
  resultProperty: 'locals.auth',
  isRevoked: isRevokedCallback,
});

export const revokeUserToken = (req, res, next) => {
  const auth = res.locals.auth;

  if (!redisClient.connected) {
    throw new InternalError('redis client not connected');
  }

  redisClient.set(auth.jti, '', 'EX', (auth.exp - auth.iat));
  return next();
};

/** Creats the user token */
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

/** Validates the user password with the compare function from bcrypt */
export const validateUserPassword = (req, res, next) => {
  const password = res.locals.validatedBody.password;

  bcrypt.compare(password, res.locals.user.passwordHash)
    .then((valid) => {
      if (valid === false) {
        throw new UnauthorizedError('Wrong username or password');
      }
      return next();
    })
    .catch(err => next(err));
};

/** Creates a hash from the user password */
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
  const user = {
    username: res.locals.validatedBody.username,
    email: res.locals.validatedBody.email,
    ...res.locals.user,
  };

  User.create(user)
    .then((dbUser) => {
      res.locals.user = dbUser;
      return next();
    })
    .catch(err => next(err));
};

export const saveUser = (req, res, next) => {
  const user = res.locals.user;

  user.save()
    .then(() => next())
    .catch(err => next(err));
};

export const findUserByUsername = (req, res, next) => {
  const username = res.locals.validatedBody.username;

  User.findOne({ username }).exec()
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Wrong username or password');
      }

      res.locals.user = user;
      return next();
    })
    .catch(err => next(err));
};

export const findUserByEmail = (req, res, next) => {
  const email = req.body.email;

  User.findOne({ email }).exec()
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Wrong email or password');
      }

      res.locals.user = user;
      return next();
    })
    .catch(err => next(err));
};

export const checkLoginUserData = [checkUsername, checkPassword];

export const checkRegisterUserData = [checkUsername,
  checkUsernameUnique,
  checkEmail,
  checkEmailUnique,
  checkPassword,
  checkPasswordConfirmation];

export const checkResetEmail = [checkEmail];

export const checkResetUserData = [checkUsername, checkPassword, checkPasswordConfirmation];

export const validateUserResetToken = (req, res, next) => {
  const token = req.query.resetToken;
  const user = res.locals.user;

  if (token && user.resetToken && user.resetTokenExpires
    && token === user.resetToken && user.resetTokenExpires > new Date()) {
    return next();
  }

  throw new UnauthorizedError('Reset token invalid or missing');
};

export const createUserResetToken = (req, res, next) => {
  const resetToken = generateRandomId(16);
  const now = new Date();
  const resetTokenExpires = new Date(now.getTime() + config.get('user.resetTokenExpiresIn'));

  if (!res.locals.user) {
    res.locals.user = {};
  }

  res.locals.user.resetToken = resetToken;
  res.locals.user.resetTokenExpires = resetTokenExpires;
  return next();
};

export const unsetResetToken = (req, res, next) => {
  const user = res.locals.user;

  if (user.resetToken && user.resetTokenExpires) {
    user.resetToken = undefined;
    user.resetTokenExpires = undefined;
  }

  return next();
};

/** Generates and sends a email to reset your password */
export const sendResetEmail = (req, res, next) => {
  const user = res.locals.user;
  const resetToken = user.resetToken;
  const resetUrl = `${config.get('frontend.url')}/#/set-password?resetToken=${resetToken}`;

  const message = {
    from: 'Movie Recommendation',
    to: user.email,
    subject: 'Reset password',
    html: `<a href="${uriInDoubleQuotedAttr(resetUrl)}">Reset password</a>`,
  };

  smtpTransporter.sendMail(message);

  return next();
};
