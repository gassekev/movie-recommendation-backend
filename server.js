import express from 'express';
import cors from 'cors';
import mongodb from 'mongodb';
import httpStatus from 'http-status';
import { json as jsonBodyParser } from 'body-parser';


const app = express();

app.use(cors());
app.use(jsonBodyParser());

app.get('/', (req, res) => {
  const recommendedMovies = ['Die Hard', 'Two Girls One Cup', 'Crank', 'JS: A Hate Story'];
  res.json(recommendedMovies);
});

app.post('/', (req, res) => {
  const MongoClient = mongodb.MongoClient;
  MongoClient.connect('mongodb://mongo:27017/userDb', (err, db) => {
    const collection = db.collection('username');
    collection.insert(req.body);
    res.sendStatus(httpStatus.OK);
  });
});

app.listen(3000, () => {
  console.log('Listening on port 3000');
});
