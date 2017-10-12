import httpStatus from 'http-status';

export default function (err, req, res, next) {
  console.log(err);

  if (err.name === 'UnauthorizedError') {
    res.status(httpStatus.UNAUTHORIZED).json({ error: 'invalid token...' });
  } else if (err.name === 'ValidationError') {
    res.status(httpStatus.BAD_REQUEST).json({ error: err.errors });
  } else if (err.name === 'AuthError') {
    res.status(httpStatus.BAD_REQUEST).json({ error: err.message });
  } else {
    res.sendStatus(httpStatus.BAD_REQUEST);
  }

  next(err);
}
