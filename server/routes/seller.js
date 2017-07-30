const express = require('express');

const router = express.Router();
const {
  loadUser,
  isAdmin,
  isAuthenticated,
  loadProduct,
  sellerProduct,
  isServiceAccount,
  validations,
} = require('../policies');
const sellerController = require('../controllers/seller');
const sellerProductController = require('../controllers/sellerProduct');

/* Create user */
router.post('/seller', validations.sellerCreate, loadUser, isAdmin, sellerController.create);

/* Signin */
router.post('/seller/signin', sellerController.signin);

/* Signin */
router.delete('/signout', sellerController.signout);

/* Accepts contact as params and send OTP to client */
router.post('/seller/otp/:contact', isServiceAccount, sellerController.sendOTP);

/* Add product */
router.post('/seller/:sellerId/addProduct',
  loadUser,
  isAuthenticated,
  loadProduct,
  sellerProductController.addProduct
);

/* Add price to product */
router.post('/seller/:sellerId/addPrice',
  loadUser,
  isAuthenticated,
  sellerProduct,
  sellerProductController.addPrice
);

/* Update price to product */
router.put('/seller/:sellerId/updatePrice',
  loadUser,
  isAuthenticated,
  sellerProduct,
  sellerProductController.updatePrice
);

module.exports = router;
