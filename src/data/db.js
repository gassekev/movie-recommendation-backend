import mongoose from 'mongoose';
import config from 'config';

const uri = `mongodb://${config.get('db.container')}:${config.get('db.port')}/${config.get('db.name')}`;

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

export function connectToDB() {
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

export function disconnectFromDB() {
  if (connection.readyState === STATES.connected) {
    return new Promise((resolve, reject) => {
      connection.once('close', () => {
        console.log(`db disconnected from: ${uri}`);
        resolve(connection);
      });

      mongoose.disconnect()
        .catch(reject);
    });
  }
  console.log('db connection already closed');
  return Promise.resolve(connection);
}
