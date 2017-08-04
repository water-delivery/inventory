const express = require('express');
const router = express.Router();
const {
  loadSeller,
  isAdmin,
  validations,
} = require('../policies');
const locationController = require('../controllers/location');

/* Add location */
router.post('/location', validations.addLocation, loadSeller, isAdmin, locationController.create);

/* find user location */
router.get('/location', locationController.find);

/* */
router.delete('/location/:locationId',
  loadSeller,
  isAdmin,
  locationController.delete
);

module.exports = router;
