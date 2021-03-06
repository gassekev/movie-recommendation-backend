/**
 * @summary   Creates and handles connection to the database
 * @author    Kevin Gasser, Simon Müller, Tobias Huonder
*/

import mongoose from 'mongoose';
import config from 'config';

const uri = config.get('mongo.uri');

mongoose.Promise = Promise;

const options = {
  promiseLibrary: Promise,
  useMongoClient: true,
};

const connection = mongoose.connection;
const STATES = mongoose.STATES;

connection.on('error', (err) => {
  console.log(`db connection error: ${err}`);
});

export default function connectToDB() {
  if (connection.readyState === STATES.disconnected) {
    return new Promise((resolve, reject) => {
      connection.once('open', () => {
        console.log(`db connected to: ${uri}`);
        resolve(connection);
      });

      mongoose.connect(uri, options)
        .catch(reject);
    });
  }
  console.log('db connection already open');
  return Promise.resolve(connection);
}
