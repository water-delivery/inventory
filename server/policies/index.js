const validations = require('./validations');
const isAdmin = require('./isAdmin');
const isAuthenticated = require('./isAuthenticated');
const loadUser = require('./loadUser');

module.exports = {
  isAdmin,
  isAuthenticated,
  loadUser,
  validations
}
