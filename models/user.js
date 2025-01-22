const getDb = require("../util/database").getDb;
const mongodb = require("mongodb");

class User {
  constructor(userName, email) {
    this.name = userName;
    this.email = email;
  }

  save() {
    const db = getDb();
    return db.collection('users').insertOne(this)
  };

  static findById(userId) {
    const db = getDb();
    return db.collection('users')
      .find({_id: new mongodb.ObjectId(userId)})
      .next()
      .then(user => {
        console.log('user', user);
        return user;
      })
      .catch(error => {console.log(error)});
  }
}

module.exports = User;