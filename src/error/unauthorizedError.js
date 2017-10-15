/**
 * @summary   Defines a unauthorized error
 * @author    Kevin Gasser, Simon Müller, Tobias Huonder
*/

export default class UnauthorizedError extends Error {
  constructor(...args) {
    super(...args);
    this.name = 'UnauthorizedError';
    this.status = 401;
    Error.captureStackTrace(this, UnauthorizedError);
  }
}
