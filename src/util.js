import bcrypt from 'bcrypt';
import crypto from 'crypto';

const saltRounds = 10;

export const hashPassword = password => bcrypt.hash(password, saltRounds);

export const validatePassword = (password, passwordHash) =>
  bcrypt.compare(password, passwordHash)
    .then((result) => {
      if (result) {
        return;
      }
      throw new Error('password mismatch');
    });

export const generateRandomId = length => crypto.randomBytes(length).toString('hex');
