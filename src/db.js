import mongodb from 'mongodb';

const url = 'mongodb://mongo:27017/movierec';
const MongoClient = mongodb.MongoClient;
let db = null;

export function connectToDB() {
  return MongoClient.connect(url)
    .then((database) => { db = database; });
}

export function getDB() {
  return db;
}

export function disconnectFromDB() {
  return db.close();
}

export function dbMiddleware(req, res, next) {
  const appendDBToRequest = () => {
    req.db = db;
    next();
  };

  if (db) {
    appendDBToRequest();
  } else {
    connectToDB()
      .then(() => appendDBToRequest())
      .catch(err => console.log(err.message));
  }
}
