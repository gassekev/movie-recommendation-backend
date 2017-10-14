import config from 'config';
import httpStatus from 'http-status';
import fetch from 'isomorphic-fetch';
import InternalError from '../../error/internalError';
import User from '../../data/model/userModel';

const BASE_URL = config.get('tmdb.url');
const API_KEY = config.get('tmdb.apiKey');

export const fetchMovies = (req, res, next) => {
  fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${req.query.name}`)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }

      return response.json()
        .then((errBody) => {
          throw new InternalError(errBody.error);
        });
    })
    .then(({ results }) => {
      res.locals.movies = results;
      next();
    })
    .catch(err => next(err));
};

export const filterMovies = (req, res, next) => {
  const movies = res.locals.movies;
  console.log(movies);
  User.findOne({ username: res.locals.auth.sub }).exec()
    .then((user) => {
      if (user) {
        res.locals.movies = movies.filter(({ id }) => !user.seenMovies.includes(id));
        next();
      } else {
        res.sendStatus(httpStatus.NOT_FOUND);
      }
    })
    .catch(err => next(err));
};
