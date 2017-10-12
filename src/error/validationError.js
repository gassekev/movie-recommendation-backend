export default class ValidationError extends Error {
  constructor(errors, ...args) {
    super(...args);
    this.name = 'ValidationError';
    this.errors = errors;
    this.status = 400;
    Error.captureStackTrace(this, ValidationError);
  }
}
