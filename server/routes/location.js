const express = require('express');
const router = express.Router();
const {
  loadUser,
  isAdmin,
  validations,
} = require('../policies');
const locationController = require('../controllers/location');

/* Add location */
router.post('/location', validations.addLocation, loadUser, isAdmin, locationController.create);

/* find user location */
router.get('/location', locationController.find);

/* */
router.delete('/location/:locationId',
  loadUser,
  isAdmin,
  locationController.delete
);

module.exports = router;
