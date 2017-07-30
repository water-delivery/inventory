const express = require('express');
const router = express.Router();
const {
  loadUser,
  isAuthenticated,
  validations,
} = require('../policies');
const cartController = require('../controllers/cart');

/* Create user */
router.post('/cart', validations.addToCart, loadUser, isAuthenticated, cartController.create);

/* find user cart */
router.get('/cart/user/:userId', cartController.findOne);

/* */
router.delete('/cart/user/:userId/product/:product',
  loadUser,
  isAuthenticated,
  cartController.delete
);

module.exports = router;
