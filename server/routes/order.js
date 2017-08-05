const express = require('express');
const router = express.Router();
const {
  loadUser,
  isUserAuthenticated,
  validations,
} = require('../policies');
const orderController = require('../controllers/order');

/* Create order */
router.post('/order', validations.orderCreate, loadUser, isUserAuthenticated, orderController.create);

/* order cancelation */
router.put('/order/:id/cancel',
  validations.orderCancellation,
  loadUser,
  isUserAuthenticated,
  orderController.cancel
);

module.exports = router;
