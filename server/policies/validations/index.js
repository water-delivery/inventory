const update = require('./update');
const sellerCreate = require('./sellerCreate');
const addToCart = require('./addToCart');
const orderCreate = require('./orderCreate');
const productCreate = require('./productCreate');
const productUpdate = require('./productUpdate');
const addLocation = require('./addLocation');

module.exports = {
  addToCart,
  orderCreate,
  productCreate,
  productUpdate,
  sellerCreate,
  update,
  addLocation
};
