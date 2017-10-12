import { check, validationResult } from 'express-validator/check';
import { matchedData } from 'express-validator/filter';
import ValidationError from '../../error/validationError';

export const checkUsername =
  check('username', 'username must only contain alphanumeric characters')
    .exists()
    .isAlphanumeric()
    .not()
    .isEmpty();

export const checkPassword =
  check('password')
    .isLength({ min: 8 }).withMessage('password must be of minimum 8 characters length')
    .exists();

export const checkPasswordConfirmation =
  check('passwordConfirmation')
    .exists()
    .isLength({ min: 8 }).withMessage('password must be of minimum 8 characters length')
    .custom((value, { req }) => value === req.body.password)
    .withMessage('"passwordConfirmation" must match "password"');

export const checkEmail =
  check('email')
    .exists()
    .isEmail()
    .not()
    .isEmpty();

export const checkValidationResult = (req, res, next) => {
  const errors = validationResult(req)
    .formatWith(({ param, location, msg, value }) => {
      if (param === 'password' || param === 'passwordConfirmation') {
        // exclude password field value
        return { param, location, msg };
      }

      return { param, location, value, msg };
    });

  if (!errors.isEmpty()) {
    return next(new ValidationError(errors.array(), 'validation failed'));
  }

  res.locals.validatedBody = matchedData(req);
  return next();
};
