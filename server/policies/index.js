const validations = require('./validations');
const isAdmin = require('./isAdmin');
const isUserAuthenticated = require('./isUserAuthenticated');
const isSellerAuthenticated = require('./isSellerAuthenticated');
const isServiceAccount = require('./isServiceAccount');
const loadUser = require('./loadUser');
const loadSeller = require('./loadSeller');
const loadProduct = require('./loadProduct');
const sellerProduct = require('./sellerProduct');

module.exports = {
  isAdmin,
  isUserAuthenticated,
  isSellerAuthenticated,
  isServiceAccount,
  loadUser,
  loadSeller,
  loadProduct,
  sellerProduct,
  validations
};
