export default class ValidationError extends Error {
  constructor(...args) {
    super(...args);
    this.name = 'ValidationError';
    Error.captureStackTrace(this, ValidationError);
  }
}
