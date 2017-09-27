import httpStatus from 'http-status';

export default function (err, req, res, next) {
  console.log(err);
  res.sendStatus(httpStatus.BAD_REQUEST);

  next(err);
}
