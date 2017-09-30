import bcrypt from 'bcrypt';
import crypto from 'crypto';
import config from 'config';
import Joi from 'joi';
import UnauthorizedError from './error/unauthorized';

export const hashPassword = password => bcrypt.hash(password, config.get('bcrypt.saltRounds'));

export const validateUser = (user) => {
  if (user) {
    return user;
  }
  throw new UnauthorizedError('wrong username or password');
};

export const validatePassword = (password, passwordHash) =>
  bcrypt.compare(password, passwordHash)
    .then((result) => {
      if (result) {
        return result;
      }
      throw new UnauthorizedError('wrong username or password');
    });

export const generateRandomId = length => crypto.randomBytes(length).toString('hex');

export const validateLoginUserData = (data) => {
  const userCredentialSchema = Joi.object().keys({
    username: Joi.string().required(),
    password: Joi.string().required(),
  });

  return Joi.validate(data, userCredentialSchema, { stripUnknown: true });
};

export const validateRegisterUserData = (data) => {
  const userRegistrationSchema = Joi.object().keys({
    username: Joi.string().required(),
    password: Joi.string().required(),
    passwordConfirmation: Joi.string().valid(Joi.ref('password')).required(),
    email: Joi.string().email().required(),
  });

  return Joi.validate(data, userRegistrationSchema, { stripUnknown: true });
};
