const express = require('express');

const router = express.Router();
const {
  loadSeller,
  isAdmin,
  validations,
} = require('../policies');
const productController = require('../controllers/product');

/* Create product */
router.post('/product', validations.productCreate, loadSeller, isAdmin, productController.create);

router.get('/product/all', productController.findAll);

router.get('/product', productController.find);

router.put('/product', validations.productUpdate, loadSeller, isAdmin, productController.update);

module.exports = router;
