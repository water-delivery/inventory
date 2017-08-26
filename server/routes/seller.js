const express = require('express');

const router = express.Router();
const {
  loadSeller,
  isAdmin,
  isSellerAuthenticated,
  loadProduct,
  sellerProduct,
  isServiceAccount,
  validations,
} = require('../policies');
const sellerController = require('../controllers/seller');
const sellerProductController = require('../controllers/sellerProduct');

/* Create user */
router.post('/seller', validations.sellerCreate, loadSeller, isAdmin, sellerController.create);

/* Signin */
router.post('/seller/signin', sellerController.signin);

/* Signin */
router.delete('/signout', sellerController.signout);

/* Accepts contact as params and send OTP to client */
router.post('/seller/otp/:contact', isServiceAccount, sellerController.sendOTP);

router.get('/seller/:sellerId', sellerController.products);

/* Add product with location and prices */
router.post('/seller/:sellerId/add',
  loadSeller,
  isSellerAuthenticated,
  validations.addProduct,
  sellerProductController.add
);

/* Add product */
router.post('/seller/:sellerId/addProduct',
  loadSeller,
  isSellerAuthenticated,
  loadProduct,
  sellerProductController.addProduct
);

/* Add price to product */
router.post('/seller/:sellerId/addPrice',
  loadSeller,
  isSellerAuthenticated,
  sellerProduct,
  sellerProductController.addPrice
);

/* Update price to product */
router.put('/seller/:sellerId/updatePrice',
  loadSeller,
  isSellerAuthenticated,
  sellerProduct,
  sellerProductController.updatePrice
);

module.exports = router;
