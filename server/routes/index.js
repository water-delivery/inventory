const seller = require('./seller');
const cart = require('./cart');
const order = require('./order');
const product = require('./product');
const location = require('./location');

const prefix = '/inventory/v1';

module.exports = (app) => {
  app.use(prefix, seller);
  app.use(prefix, product);
  app.use(cart);
  app.use(prefix, order);
  app.use(prefix, location);
};
