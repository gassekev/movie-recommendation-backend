/**
 * @summary   Creates and handles connection to the database
 * @author    Kevin Gasser, Simon Müller, Tobias Huonder
*/

import mongoose from 'mongoose';
import config from 'config';

const uri = `mongodb://${config.get('db.host')}:${config.get('db.port')}/${config.get('db.name')}`;

mongoose.Promise = Promise;

const options = {
  user: config.get('db.username'),
  pass: config.get('db.password'),
  promiseLibrary: Promise,
  useMongoClient: true,
  auth: {
    authdb: 'admin',
  },
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
