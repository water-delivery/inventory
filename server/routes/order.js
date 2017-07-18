const express = require('express');
const router = express.Router();
const {
  loadUser,
  isAuthenticated,
  validations,
} = require('../policies');
const orderController = require('../controllers/order');

/* Create user */
router.post('/order', validations.orderCreate, loadUser, isAuthenticated, orderController.create);


module.exports = router;
