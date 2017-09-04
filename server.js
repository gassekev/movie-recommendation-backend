import express from 'express';
import cors from 'cors';
import { json as jsonBodyParser } from 'body-parser';
import { connectToDB } from './src/data/db';
import User from './src/data/model/user';
import movieRouter from './src/controller/router/movie';

const app = express();

// TODO: remove testUser
// START TESTING
const testUser = {
  username: 'aip',
  email: 'aip@student.uts.edu.au',
  seenMovies: [
    'Fast 10: your seatbelts',
  ],
};

// create test user
User.create(testUser)
  .catch(err => console.log(err.message));
// END TESTING

app.use(cors());
app.use(jsonBodyParser());

// use movie router and append to top level route
app.use('/', movieRouter);

connectToDB()
  .then(() => app.listen(3001))
  .catch(err => console.log(err.message));
