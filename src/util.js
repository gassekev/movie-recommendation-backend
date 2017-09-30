import bcrypt from 'bcrypt';
import crypto from 'crypto';
import config from 'config';
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
