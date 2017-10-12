export default class InternalError extends Error {
  constructor(...args) {
    super(...args);
    this.name = 'InternalError';
    this.status = 500;
    Error.captureStackTrace(this, InternalError);
  }
}
