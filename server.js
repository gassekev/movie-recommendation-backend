import express from 'express';
import cors from 'cors';
import mongodb from 'mongodb';
import httpStatus from 'http-status';
import { json as jsonBodyParser } from 'body-parser';


const app = express();

app.use(cors());
app.use(jsonBodyParser());

app.get('/', (req, res) => {
  const recommendedMovies = ['Die Hard 4.0', 'Fast 10: your seatbelts', 'Crank', 'JS: A Hate Story'];
  res.json(recommendedMovies);
});

app.post('/', (req, res) => {
  const MongoClient = mongodb.MongoClient;
  MongoClient.connect('mongodb://mongo:27017/movierec', (err, db) => {
    const collection = db.collection('watchedmovies');
    collection.insert(req.body);
    res.sendStatus(httpStatus.OK);
  });
});

app.listen(3000, () => {
  console.log('Listening on port 3000');
});
