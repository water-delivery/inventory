const seller = require('./seller');
const cart = require('./cart');
const order = require('./order');
const product = require('./product');

module.exports = function (app) {
  app.use(seller);
  app.use(product);
  app.use(cart);
  app.use(order);
}
