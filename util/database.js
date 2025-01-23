const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;

let _db;
const mongoConnect = (callback) => {
  MongoClient.connect('mongodb+srv://danilaprokopenko:+-12DanPila@cluster0.xpzo9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')// here connect url Mongodb
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