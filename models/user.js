const getDb = require("../util/database").getDb;
const mongodb = require("mongodb");
const {ObjectId} = require("mongodb");

class User {
  constructor(userName, email, cart, id) {
    this.name = userName;
    this.email = email;
    this.cart = cart;
    this._id = id;
  }

  save() {
    const db = getDb();
    return db.collection('users').insertOne(this);
  };

  addToCart(product) {
    const db = getDb();
    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];
    const cartProductIndex = this.cart.items.findIndex(
      item => item.productId.toString() === product._id.toString()
    );
    if (cartProductIndex >= 0) {
      newQuantity = this.cart.items[cartProductIndex].quantity + 1;
      updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
      updatedCartItems.push({
        productId: new ObjectId(product._id),
        quantity: newQuantity,
      });
    }
    const updatedCart = {
      items: updatedCartItems
    };
    return db.collection('users').updateOne(
      {_id: new ObjectId(this._id)},
      { $set: { cart: updatedCart } }
    );
  }

  getCart() {
    const db = getDb();
    console.log('this.cart', this.cart);
    const productIds = this.cart.items.map(item => item.productId);
    return db.collection('products')
      .find({_id: {$in: productIds}})
      .toArray()
      .then((products) => {
        return products.map(item => {
          return {
            ...item,
            quantity: this.cart.items.find(i => {
              return i.productId.toString() === item._id.toString();
            }).quantity
          };
        })
      })
      .catch((err) => {console.log(err);});
  }

  addOrder() {
    const db = getDb();
    return this.getCart()
      .then(products => {
        const order = {
          items: products,
          user: {
            _id: new ObjectId(this._id),
            name: this.name
          }
        }
        return db.collection('orders').insertOne(order)
      })
      .then(() => {
        this.cart = {items: []};

        return db.collection('users').insertOne(
          {_id: new ObjectId(this._id)},
          { $set: { cart: { items: [] } } },
        )
      })
  }

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

  deleteItemFromCart(prodId) {
    const db = getDb();
    const updatedCartItems = this.cart.items.filter(item => item.productId.toString() !== prodId);

    return db.collection('users').updateOne(
      {_id: new ObjectId(this._id)},
      { $set: { cart: { items: updatedCartItems } } },
    );
  }

  getOrder() {
    const db = getDb();
    return db
      .collection('orders')
      .find({'user._id': new ObjectId(this._id)})
      .toArray();
  }
}

module.exports = User;