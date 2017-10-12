export default class AuthError extends Error {
  constructor(...args) {
    super(...args);
    this.name = 'AuthError';
    Error.captureStackTrace(this, AuthError);
  }
}
