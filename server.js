import express from 'express';
import cors from 'cors';
import httpStatus from 'http-status';
import { json as jsonBodyParser } from 'body-parser';
import { dbMiddleware } from './src/db';

const app = express();

app.use(cors());
app.use(jsonBodyParser());
app.use(dbMiddleware);

app.get('/recommendations', (req, res) => {
  const recommendedMovies = ['Die Hard 4.0', 'Fast 10: your seatbelts',
    'Crank', 'JS: A Hate Story'];
  res.json(recommendedMovies);
});

app.post('/watchedmovie', (req, res) => {
  const collection = req.db.collection('watchedmovies');
  collection.insert(req.body)
    // TODO: Remove test output
    .then(() => collection.find().toArray())
    // TODO Add logger instead of console.log
    .then(docs => console.log(docs))
    // end remove
    .then(() => res.sendStatus(httpStatus.CREATED))
    .catch(() => res.sendStatus(httpStatus.BAD_REQUEST));
});

app.listen(3001, () => {
  console.log('Listening on port 3001');
});
