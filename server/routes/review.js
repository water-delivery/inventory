const express = require('express');
const router = express.Router();
const {
  loadUser,
  isUserAuthenticated,
  validations,
} = require('../policies');
const reviewController = require('../controllers/review');

/* Add review */
router.post('/review', validations.addReview, loadUser, isUserAuthenticated, reviewController.create);

/* Get user review */
router.get('/review/me', loadUser, isUserAuthenticated, reviewController.findOne);

/* Get product reviews */
router.get('/review', reviewController.find);

/* */
router.delete('/review/:id',
  loadUser,
  isUserAuthenticated,
  reviewController.delete
);

module.exports = router;
