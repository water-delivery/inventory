const express = require('express');
const router = express.Router();
const {
  loadUser,
  isAdmin,
  validations,
} = require('../policies');
const productController = require('../controllers/product');

/* Create product */
router.post('/product', validations.productCreate, loadUser, isAdmin, productController.create);

router.get('/product', productController.find);

router.put('/product', validations.productUpdate, loadUser, isAdmin, productController.update);

module.exports = router;
