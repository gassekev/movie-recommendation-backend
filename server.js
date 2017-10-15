/**
 * @summary   Creats a express server and defines middleware
 * @author    Kevin Gasser, Simon Müller, Tobias Huonder
*/

import express from 'express';
import cors from 'cors';
import config from 'config';
import helmet from 'helmet';
import { json as jsonBodyParser } from 'body-parser';
import connectToDB from './src/data/db';
import controller from './src/controller/';

const app = express();

app.use(helmet());
app.use(cors());
app.use(jsonBodyParser());

// use movie router and append to top level route
app.use('/', controller);

connectToDB()
  .then(() => app.listen(config.get('http.port')))
  .catch(err => console.log(err));
