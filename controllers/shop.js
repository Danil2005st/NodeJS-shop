const Product = require('../models/product');
const Order = require('../models/order');

exports.getProducts = (req, res) => {
  Product.find()
    .then(products => {
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All Products',
        path: '/products'
      });
    })
    .catch((err) => {console.log(err)})
};

exports.getProduct = (req, res) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(product => {
      res.render('shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: '/products',
      })
    }).catch((err) => {console.log(err)});
};

exports.getIndex = (req, res) => {
  Product.find().then(products => {
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/'
    });
  }).catch((err) => {console.log(err)})
};

exports.getCart = (req, res) => {
  req.user
    .populate('cart.items.productId')
    .then(user => {
      const products = user.cart.items;
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: products,
      });
    })
    .catch((err) => {console.log(err)});
};

exports.postCart = (req, res) => {
  const prodId = req.body.productId;

  Product.findById(prodId)
    .then(product => {
      return req.user.addToCart(product);
    })
    .then(result => {
      console.log('result', result);
      res.redirect('/cart');
    })
    .catch(err=>{console.log(err)});
};

exports.postCartDeleteProduct = (req, res) => {
  const prodId = req.body.productId;

  req.user
    .removeFromCart(prodId)
    .then(() => {
      console.log("Deleted product");
      res.redirect('/cart');
    })
    .catch(err => console.log(err));
};

exports.postOrder = (req, res) => {
  req.user
    .populate('cart.items.productId')
    .then(user => {
      const products = user.cart.items.map(item => {
        return {quantity: item.quantity, product: {...item.productId._doc}};
      });

      const order = new Order({
        user: {
          name: req.user.name,
          userId: req.user,
        },
        products: products,
      });
      return order.save();
    })
    .then(() => {
      return req.user.clearCart();
    })
    .then(() => {
      res.redirect('/orders');
    })
    .catch((err) => {console.log(err)});
};

exports.getOrders = (req, res) => {
  console.log('req.user', req);

  Order.find({'user.userId': req.user._id})
    .then(orders => {
      console.log('orders', orders);
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Orders',
        orders: orders,
      });
    })
    .catch((err) => {console.log(err)})

  // req.user
  //   .populate('cart.items.productId')
  //   .then(user => {
  //     const products = user.cart.items;
  //     res.render('shop/cart', {
  //       path: '/cart',
  //       pageTitle: 'Your Cart',
  //       products: products,
  //     });
  //   })
  //   .catch((err) => {console.log(err)});
};
