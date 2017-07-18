const Product = require('../models').product;
const async = require('async');

module.exports = {
  find: (req, res) => {
    return res.status(200).send({
      message: 'Hello, World!!'
    })
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
