const Product = require('../models').product;
const SellerProduct = require('../models').sellerProduct;
const sequelize = require('../models').sequelize;
const Price = require('../models').price;
const async = require('async');

module.exports = {
  find: (req, res) => {
    const offset = parseInt(req.query.skip || 0 , 10);
    const limit = parseInt(req.query.limit || 20 , 10);
    const capacity = parseInt(req.query.capacity || 20 , 10);
    const locationId = req.query.locationId;
    const criteria = {};

    // Build criteria
    if (isFinite(capacity)) criteria.capacity = capacity;
    if (isFinite(locationId)) criteria.locationId = locationId;

    return sequelize
      .query('SELECT productFilter(:locationId, :limit, :skip); ',
        {
          replacements: {
            locationId: criteria.locationId || null,
            limit: limit,
            skip: offset,
          },
          type: sequelize.QueryTypes.SELECT
        }
      )
      .then(results => {
        const products = results && results[0] && results[0].productfilter;
        return res.ok(products || []);
      })
      .catch(res.negotiate);
  },

  findOne: (req, res) => {
    return res.status(200).send({
      message: 'Hello, World!!'
    })
  },
  create: (req, res) => {
    const { name, avatar, description, capacity, meta, address } = req.body || {};
    async.waterfall([
      function addProduct(next) {
        Product.create({
          name,
          avatar,
          description,
          capacity,
          meta,
          address
        })
        .then(newRecord => next(null, newRecord))
        .catch(next);
      },
      function sendNotificationsToAdmin(product, next) {
        // Send notification
        return next(null, product);
      }
    ], (err, product) => {
      if (err) {
        return res.status(500).send(err);
      }
      return res.status(201).send({
        message: 'Product added successfully!',
        product
      });
    })
  },
  update: (req, res) => {
    return res.status(200).send({
      message: 'Hello, World!!'
    })
  },
  delete: (req, res) => {
    return res.status(200).send({
      message: 'Hello, World!!'
    })
  },
}
