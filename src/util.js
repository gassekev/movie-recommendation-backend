import bcrypt from 'bcrypt';
import crypto from 'crypto';
import config from 'config';
import UnauthorizedError from './error/unauthorized';

export const hashPassword = password => bcrypt.hash(password, config.get('bcrypt.saltRounds'));

export const validatePassword = (password, passwordHash) =>
  bcrypt.compare(password, passwordHash)
    .then((result) => {
      if (result) {
        return;
      }
      throw new UnauthorizedError('wrong username or password');
    });

export const generateRandomId = length => crypto.randomBytes(length).toString('hex');
