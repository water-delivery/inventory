const validations = require('./validations');
const isAdmin = require('./isAdmin');
const isAuthenticated = require('./isAuthenticated');
const isServiceAccount = require('./isServiceAccount');
const loadUser = require('./loadUser');
const loadProduct = require('./loadProduct');
const sellerProduct = require('./sellerProduct');

module.exports = {
  isAdmin,
  isAuthenticated,
  isServiceAccount,
  loadUser,
  loadProduct,
  sellerProduct,
  validations
};
