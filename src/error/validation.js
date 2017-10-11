export default class ValidationError extends Error {
  constructor(errors, ...args) {
    super(...args);
    this.name = 'ValidationError';
    this.errors = errors;
    Error.captureStackTrace(this, ValidationError);
  }
}
