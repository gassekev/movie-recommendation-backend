export default class UnauthorizedError extends Error {
  constructor(...args) {
    super(...args);
    this.name = 'UnauthorizedError';
    Error.captureStackTrace(this, UnauthorizedError);
  }
}
