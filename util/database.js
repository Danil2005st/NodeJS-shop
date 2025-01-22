const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;

let _db;
const mongoConnect = (callback) => {
  MongoClient.connect('')// here connect url Mongodb
    .then((client) => {
      console.log('MongoDB Connected');
      _db = client.db();
      return callback(client);
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
}

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw new Error('No DataBase Found!');
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;