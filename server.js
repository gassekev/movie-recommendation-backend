import express from 'express';
import cors from 'cors';
import mongodb from 'mongodb';
import httpStatus from 'http-status';
import { json as jsonBodyParser } from 'body-parser';

const app = express();
const MongoClient = mongodb.MongoClient;
let db = null;

app.use(cors());
app.use(jsonBodyParser());

app.get('/', (req, res) => {
  const recommendedMovies = ['Die Hard 4.0', 'Fast 10: your seatbelts', 'Crank', 'JS: A Hate Story'];
  res.json(recommendedMovies);
});

app.post('/', (req, res) => {
  const collection = db.collection('watchedmovies');
  collection.insert(req.body)
    // TODO: Remove test output
    .then(() => collection.find().toArray())
    .then(docs => console.log(docs))
    // end remove
    .then(() => res.sendStatus(httpStatus.CREATED))
    .catch(() => res.sendStatus(httpStatus.BAD_REQUEST));
});

MongoClient.connect('mongodb://mongo:27017/movierec')
  .then((database) => { db = database; })
  .then(() => app.listen(3001, () => {
    console.log('Listening on port 3001');
  }))
  .catch(err => console.log(err.message));
