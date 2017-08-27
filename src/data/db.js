import mongoose from 'mongoose';

const uri = 'mongodb://mongo:27017/movierec';

mongoose.Promise = Promise;

const options = {
  promiseLibrary: Promise,
};

mongoose.connection.on('error', (err) => {
  console.log(`db connection error: ${err}`);
});

export function connectToDB() {
  mongoose.connect(uri, options);
}

export function disconnectFromDB() {
  mongoose.disconnect();
}
