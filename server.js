import express from 'express';
import httpStatus from 'http-status';
import cors from 'cors';
import { json as jsonBodyParser } from 'body-parser';

const app = express();

app.use(cors());
app.use(jsonBodyParser());

app.get('/', (req, res) => {
  res.status(httpStatus.OK).json({});
});

app.listen(3000, () => {
  console.log('Listening on port 3000');
});
