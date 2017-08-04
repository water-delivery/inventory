const express = require('express');
const router = express.Router();
const {
  loadUser,
  isUserAuthenticated,
  validations,
} = require('../policies');
const orderController = require('../controllers/order');

/* Create user */
router.post('/order', validations.orderCreate, loadUser, isUserAuthenticated, orderController.create);


module.exports = router;
