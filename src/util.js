import bcrypt from 'bcrypt';

const saltRounds = 10;

export const hashPassword = password => bcrypt.hash(password, saltRounds);

export const comparePassword = (password, passwordHash) =>
  bcrypt.compare(password, passwordHash)
    .then((result) => {
      if (result) {
        return;
      }
      throw new Error('password mismatch');
    });
