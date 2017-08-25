const models = require('../models');
const Seller = require('../models').seller;
const SellerProduct = require('../models').sellerProduct;
const AccessToken = require('../models').accessToken;
const async = require('async');
const redisService = require('../services').redis;
const smsService = require('../services').sms;
const notificationService = require('../services').notification;

const {
  generateRandomNumber,
  generateOTPTextMessage,
  getToken
} = require('../utils');
const {
  CONTACT_NUMBER_VERIFICATION,
  ACCOUNT_AUTHENTICATION,
  SELLER_NOT_FOUND,
  // PASSWORD_NOT_MATCHED,
  INVALID_OTP,
  OTP_MISMATCH
} = require('../constants');

module.exports = {
  products: (req, res) => {
    const sellerId = req.params.sellerId;
    const limit = req.query.limit || 30;
    const skip = req.query.skip || 0;
    if (!sellerId || isNaN(sellerId)) {
      return res.badRequest({
        message: 'Required param sellerId is missing or not an integer'
      });
    }
    // return SellerProduct.findAll({
    //   where: {
    //     sellerId
    //   },
    //   include: [{
    //     model: models.price,
    //     attributes: ['sellerProductId', 'amount']
    //   }]
    // })
    return models.sequelize
      .query('SELECT sellerProducts(:sellerId, :limit, :skip); ',
      {
        replacements: {
          sellerId,
          limit,
          skip,
        },
        type: models.sequelize.QueryTypes.SELECT
      })
      .then(results => {
        const products = results && results[0] && results[0].sellerproducts;
        return res.ok(products || []);
      })
    .catch(res.negotiate);
  },

  create: (req, res) => {
    const { firstName, lastName, password, contact, description, email } = req.body;
    // All validations should be done by now!
    // TODO: Get other possible information from the device he is logging in!
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
            });
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
        .catch(next);
        // .catch(console.log);
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
      const { token } = req.body;
      const { deviceId } = req.options;
      if (token && deviceId) {
        notificationService.subscribe({
          userId: user.id,
          userType: 'seller',
          token,
          deviceId,
          contact,
          firstName,
          status: 'loggedIn'
        })
        .then(logger.debug)
        .catch(logger.error);
      }
      return res.status(201).send(user);
    });
  },

  signin: (req, res) => {
    // All validations should be done by now!
    const { contact, otp, meta, token } = req.body;
    const criteria = {
      type: ACCOUNT_AUTHENTICATION,
      token: contact
    };
    return async.waterfall([
      function findSeller(next) {
        Seller.findOne({ where: { contact } })
        .then(seller => {
          if (!seller) return res.notFound(SELLER_NOT_FOUND);
          return next(null, seller);
        })
        .catch(next);
      },
      function validateOTP(user, next) {
        return redisService.findOne(criteria)
        .then(value => {
          if (!value) return next(INVALID_OTP);
          if (parseInt(value.data, 10) !== otp) return next(OTP_MISMATCH);
          return next(null, user);
        })
        .catch(next);
      },
      function generateToken(seller, next) {
        return AccessToken.create({
          sellerId: seller.id,
          device: meta && meta.device
        })
        .then(newRecord => next(null, {
          id: seller.id,
          firstName: seller.firstName,
          lastName: seller.lastName,
          avatar: seller.avatar,
          contact: seller.contact,
          description: seller.description,
          email: seller.email,
          roles: seller.roles,
          accessToken: newRecord.token
        }))
        .catch(next);
      }
    ], (err, seller) => {
      if (err) {
        return res.unAuthorized(err);
      }
      // Dont wait for this response
      redisService.destroy(criteria);
      const { deviceId } = req.options;
      if (deviceId) {
        notificationService.update({
          userId: seller.id,
          userType: 'seller',
          deviceId,
          token,
          status: 'loggedIn'
        })
        .then(logger.debug)
        .catch(logger.error);
      }
      return res.ok(seller);
    });
  },

  signout: (req, res) => {
    AccessToken.destroy({
      where: {
        token: getToken(req)
      }
    })
    .then(affectedRows => {
      const { deviceId } = req.options;
      if (deviceId) {
        notificationService.update({
          deviceId,
          status: 'anon'
        })
        .then(logger.debug)
        .catch(logger.error);
      }
      return res.noContent(affectedRows);
    })
    .catch(res.serverError);
  },

  /**
   * TODO: This can moved to notifications service once its up
   * Sends a One Time Password (OTP) for validating contact info
   * @param  {[type]} req [description]
   * @param  {[type]} res [description]
   * @return {[type]}     [description]
   */
  sendOTP: (req, res) => {
    const contact = req.params.contact;
    let operationType = ACCOUNT_AUTHENTICATION;
    let operation = 'signin';
    async.waterfall([
      function checkIfContactExists(next) {
        // if (action === 'signin') return next();
        return Seller.findOne({
          where: {
            contact
          }
        })
        .then(record => {
          if (!record) {
            operation = 'signup';
            operationType = CONTACT_NUMBER_VERIFICATION;
          }
          return next();
        })
        .catch(next);
      },
      // Create a redis record
      function LogInRedis(next) {
        redisService.create({
          type: operationType,
          data: generateRandomNumber(),
          token: contact,
        })
        .then(value => next(null, value))
        .catch(next);
      },
      // send a message to that phone number
      function SendSMS(value, next) {
        // if storing in redis fails, bail out
        if (!value) {
          return res.negotiate();
        }
        smsService.send(generateOTPTextMessage(value.data), contact)
        .then(response => next(null, value, response))
        .catch(next);
      }
    ], (err, result) => {
      if (err) return res.serverError(err);
      const { type, data, token } = result;
      return res.ok({
        operation,
        type,
        data,
        token
      });
    });
  }
};
