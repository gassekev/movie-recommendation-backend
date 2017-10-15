/**
 * @summary   Router for the movies
 * @author    Kevin Gasser, Simon Müller, Tobias Huonder
*/

import { Router } from 'express';
import httpStatus from 'http-status';
import { fetchMovies, filterMovies } from '../middleware/movieMiddleware';

const router = new Router();

router.get('/', fetchMovies, filterMovies, (req, res) => {
  const movies = res.locals.movies.map(({ id, title, overview }) => ({ id, title, overview }));

  res.status(httpStatus.OK).json(movies);
});

export default router;
