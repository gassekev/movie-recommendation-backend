import httpStatus from 'http-status';

export default function (err, req, res, next) {
  switch (err.name) {
    case 'UnauthorizedError':
      res.status(httpStatus.UNAUTHORIZED).json({ error: err.message });
      break;
    default:
      res.sendStatus(httpStatus.BAD_REQUEST);
  }

  next(err);
}
