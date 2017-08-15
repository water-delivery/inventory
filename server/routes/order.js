const express = require('express');

const router = express.Router();
const {
  loadUser,
  loadSeller,
  isUserAuthenticated,
  isSellerAuthenticated,
  validations,
} = require('../policies');
const orderController = require('../controllers/order');

/* Create order */
router.post('/order', validations.orderCreate, loadUser, isUserAuthenticated, orderController.create);

/* Get user orders */
router.get('/order/user', loadUser, isUserAuthenticated, orderController.findUserOrders);

/* Get seller orders */
router.get('/order/seller', loadSeller, isSellerAuthenticated, orderController.findSellerOrders);

/* Get seller order metrics */
router.get('/order/seller/stats', loadSeller, isSellerAuthenticated, orderController.getOrderStats);


/* order cancelation */
router.put('/order/:id/cancel',
  validations.orderCancellation,
  loadUser,
  isUserAuthenticated,
  orderController.cancel
);

module.exports = router;
