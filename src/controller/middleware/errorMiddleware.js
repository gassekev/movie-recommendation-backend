/**
 * @summary   Middleware that handles the errors and generates error proper massages
 * @author    Kevin Gasser, Simon Müller, Tobias Huonder
*/

import httpStatus from 'http-status';

export default function (err, req, res, next) {
  console.log(err);

  if (err.name === 'UnauthorizedError') {
    const clientError = {
      message: err.message,
      status: err.status,
    };

    res.status(err.status).json({ error: clientError });
  } else if (err.name === 'ValidationError') {
    const clientError = {
      message: err.message,
      status: err.status,
      errors: err.errors.reduce((o, e) => ({ ...o, [e.param]: e.msg }), {}),
    };

    res.status(err.status).json({ error: clientError });
  } else if (err.name === 'InternalError') {
    // do not leak error message here!
    res.sendStatus(err.status);
  } else {
    res.sendStatus(httpStatus.BAD_REQUEST);
  }

  next(err);
}
