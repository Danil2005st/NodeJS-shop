const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const orderSchema = new Schema({
  products: [{
    product: {
      type: Object,
      required: true
    },
    quantity: {
      type: Number,
      required: true
    }
  }],
  user: {
    name: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    }
  }
});

module.exports = mongoose.model('Order', orderSchema);










// const mongodb = require('mongodb');
// const getDb = require('../util/database').getDb;
//
// class Product {
//   constructor(title, description, price, imageUrl, id, userId) {
//     this.title = title;
//     this.price = price;
//     this.description = description;
//     this.imageUrl = imageUrl;
//     this._id = id ? new mongodb.ObjectId(id) : null;
//     this.userId = userId;
//   }
//
//   save() {
//     const db = getDb();
//     let db0p;
//
//     if (this._id) {
//       console.log('products 11', this)
//       db0p = db.collection('products')
//         .updateOne({_id: this._id}, {$set: this});
//     } else {
//       console.log('products 11', this)
//       db0p = db.collection('products').insertOne(this);
//     }
//     return db0p
//       .then(result => {
//         console.log('result', result);
//       })
//       .catch(error => {console.log(error)});
//   }
//
//   static fetchAll() {
//     const db = getDb();
//     return db.collection('products')
//       .find()
//       .toArray()
//       .then(products => {
//         console.log(products);
//         return products;
//       })
//       .catch(error => {console.log(error)});
//   }
//
//   static findById(prodId) {
//     const db = getDb();
//     return db.collection('products')
//       .find({_id: new mongodb.ObjectId(prodId)})
//       .next()
//       .then(product => {
//         console.log('product', product);
//         return product;
//       })
//       .catch(error => {console.log(error)});
//   }
//
//   static deleteById(prodId) {
//     const db = getDb();
//     return db.collection('products')
//       .deleteOne({_id: new mongodb.ObjectId(prodId)})
//       .then(() => {
//         console.log(`Product ${prodId} deleted`);
//       })
//       .catch(error => {console.log(error)});
//   }
// }
//
// module.exports = Product;