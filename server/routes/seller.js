const express = require('express');
const router = express.Router();
const {
  loadUser,
  isAdmin,
  validations,
} = require('../policies');
const sellerController = require('../controllers/seller');

/* Create user */
router.post('/seller', validations.sellerCreate, loadUser, isAdmin, sellerController.create);

/* Signin */
router.post('/seller/signin', sellerController.signin);

/* Signin */
// router.post('/seller/signout', sellerController.signout);

module.exports = router;
