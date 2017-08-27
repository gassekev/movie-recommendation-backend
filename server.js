import express from 'express';
import cors from 'cors';
import httpStatus from 'http-status';
import { json as jsonBodyParser } from 'body-parser';
import { connectToDB } from './src/data/db';
import User from './src/data/model/user';

const app = express();
const user = {
  username: 'aip',
  email: 'aip@student.uts.edu.au',
  seenMovies: [
    'Fast 10: your seatbelts',
  ],
};

User.create(user);

app.use(cors());
app.use(jsonBodyParser());

app.get('/recommendations', (req, res) => {
  User.findOne({ username: user.username }).exec()
    .then(dbUser => res.json(dbUser));
});

app.post('/watchedmovies', (req, res) => {
  User.update(
    { username: user.username },
    { $push: { seenMovies: { $each: req.body } } }).exec()
    .then(() => res.sendStatus(httpStatus.OK))
    .catch(() => res.sendStatus(httpStatus.BAD_REQUEST));
});

connectToDB();

app.listen(3001, () => {
  console.log('Listening on port 3001');
});
