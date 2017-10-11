import crypto from 'crypto';
import Joi from 'joi';

export const generateRandomId = length => crypto.randomBytes(length).toString('hex');

export const validateData = (data, schema, next) => {
  Joi.validate(data, schema)
    .then(() => next())
    .catch(err => next(err));
};

export const matchesField = field =>
  Joi.any().valid(Joi.ref(field)).options({
    language: {
      any: { allowOnly: `must match "${field}"` },
    },
  });
