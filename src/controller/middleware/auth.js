import jwtExpress from 'express-jwt';
import config from 'config';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import User from '../../data/model/user';
import AuthError from '../../error/auth';
import { generateRandomId, smtpTransporter } from '../../util';
import redisClient from '../../data/redis';
import { checkUsername,
  checkPassword,
  checkPasswordConfirmation,
  checkEmail } from './validation';

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

export const validateUserToken = jwtExpress({
  secret: config.get('jwt.secret'),
  resultProperty: 'locals.auth',
  isRevoked: isRevokedCallback,
});

export const revokeUserToken = (req, res, next) => {
  const auth = res.locals.auth;

  if (!redisClient.connected) {
    throw new Error('redis client not connected');
  }

  redisClient.set(auth.jti, '', 'EX', (auth.exp - auth.iat));
  return next();
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
  const password = res.locals.validatedBody.password;

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
        throw new AuthError('wrong username or password');
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
        throw new AuthError('wrong email or password');
      }

      res.locals.user = user;
      return next();
    })
    .catch(err => next(err));
};

export const checkLoginUserData = [checkUsername, checkPassword];

export const checkRegisterUserData = [checkUsername,
  checkEmail,
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

  throw new AuthError('reset token invalid or missing');
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

export const sendResetEmail = (req, res, next) => {
  const user = res.locals.user;
  const resetToken = user.resetToken;

  const message = {
    from: 'Movie Recommendation',
    to: user.email,
    subject: 'Reset password',
    html: `<a href="${config.get('frontend.url')}/set-new-password?resetToken=${resetToken}" >
      Reset password</a>`,
  };

  smtpTransporter.sendMail(message, (err, info) => {
    if (err) {
      return next(err);
    }

    console.log(`Message sent: ${info.messageId}`);
    console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);

    return next();
  });
};
