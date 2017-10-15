/**
 * @summary   Defines the validation error
 * @author    Kevin Gasser, Simon Müller, Tobias Huonder
*/

export default class ValidationError extends Error {
  constructor(errors, ...args) {
    super(...args);
    this.name = 'ValidationError';
    this.errors = errors;
    this.status = 400;
    Error.captureStackTrace(this, ValidationError);
  }
}
