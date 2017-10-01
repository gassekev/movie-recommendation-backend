import httpStatus from 'http-status';

export default function (err, req, res, next) {
  console.log(err);

  switch (err.name) {
    case 'UnauthorizedError':
      res.status(httpStatus.UNAUTHORIZED).json({ error: 'invalid token...' });
      break;
    case 'ValidationError':
      res.status(httpStatus.BAD_REQUEST).json({ error: err.message });
      break;
    case 'AuthError':
      res.status(httpStatus.BAD_REQUEST).json({ error: err.message });
      break;
    default:
      res.sendStatus(httpStatus.BAD_REQUEST);
  }

  next(err);
}
