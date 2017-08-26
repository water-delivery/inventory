const update = require('./update');
const sellerCreate = require('./sellerCreate');
const addToCart = require('./addToCart');
const addReview = require('./addReview');
const orderCreate = require('./orderCreate');
const orderCancellation = require('./orderCancellation');
const productCreate = require('./productCreate');
const productUpdate = require('./productUpdate');
const addLocation = require('./addLocation');
const addProduct = require('./addProduct');

module.exports = {
  addToCart,
  addReview,
  orderCreate,
  orderCancellation,
  productCreate,
  productUpdate,
  sellerCreate,
  update,
  addLocation,
  addProduct,
};
