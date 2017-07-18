const Seller = require('../models').seller;
const AccessToken = require('../models').accessToken;
const async = require('async');

const validations = {
  SELLER_NOT_FOUND: {
    message: 'User not found in the database'
  },
  PASSWORD_NOT_MATCHED: {
    message: 'Password didn\'t match with the given username'
  }
}

module.exports = {
  create: (req, res) => {
    const { firstName, lastName, password, contact, contactSecondary, description, email } = req.body;
    // All validations should be done by now!
    // TODO: Get other possible information from the device he is logging in!
    console.log(req.body);
    const sellerObject = {
      firstName,
      lastName,
      password,
      contact,
      description,
      email,
    };
    return async.waterfall([
      function createSeller(next) {
        Seller.create(sellerObject)
        .then(record => {
          if (!record) {
            return next({
              message: 'Creation of seller failed'
            })
          }
          return next(null, {
            firstName: record.firstName,
            lastName: record.lastName,
            avatar: record.avatar,
            contact: record.contact,
            description: record.description,
            email: record.email
          });
        })
        // .catch(next);
        .catch(console.log);
      },
    ], function final(error, user) {
      if (error) {
        if (error.name) {
          switch (error.name) {
            case 'SequelizeValidationError':
              return res.status(400).send(error);
            case 'SequelizeUniqueConstraintError':
              return res.status(400).send({
                errors: error.errors,
                fields: error.fields
              });
            default:
              return res.status(400).send(error);
          }
        }
        return res.status(400).send(error);
      }
      return res.status(201).send(user);
    });
  },

  signin: function (req, res) {
    // All validations should be done by now!
    const { contact, password, meta } = req.body;
    return async.waterfall([
      function findSeller(next) {
        Seller.findOne({ where: { contact } })
        .then(seller => {
          if (!seller) return res.status(404).send(validations.SELLER_NOT_FOUND);
          return next(null, seller);
        })
        .catch(console.log);
      },
      function validatePassword(seller, next) {
        return Seller.validatePassword(password, seller.password)
          .then(isValid => {
            if (isValid) return next(null, seller);
            return res.status(401).send(validations.PASSWORD_NOT_MATCHED);
          })
          .catch(next);
      },
      function generateToken(seller, next) {
        return AccessToken.create({
          sellerId: seller.id,
          device: meta && meta.device
        })
        .then(newRecord => {
          return next(null, {
            firstName: seller.firstName,
            lastName: seller.lastName,
            avatar: seller.avatar,
            contact: seller.contact,
            description: seller.description,
            email: seller.email,
            roles: seller.roles,
            accessToken: newRecord.token
          });
        })
        .catch(console.log);
      }
    ], (err, seller) => {
      if (err) {
        return res.status(401).send()
      }
      return res.status(200).send(seller)
    });
  },


}
