import express from 'express';
import cors from 'cors';
import config from 'config';
import { json as jsonBodyParser } from 'body-parser';
import connectToDB from './src/data/db';
import controller from './src/controller/';

const app = express();

app.use(cors());
app.use(jsonBodyParser());

// use movie router and append to top level route
app.use('/', controller);

connectToDB()
  .then(() => app.listen(config.get('http.port')))
  .catch(err => console.log(err));
