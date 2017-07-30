const Seller = require('../models').seller;
const AccessToken = require('../models').accessToken;
const async = require('async');
const redisService = require('../services').redis;
const smsService = require('../services').sms;
const {
  generateRandomNumber,
  generateOTPTextMessage,
  getToken
} = require('../utils');
const {
  CONTACT_NUMBER_VERIFICATION,
  CONTACT_ALREADY_REGISTERED,
  ACCOUNT_AUTHENTICATION,
  SELLER_NOT_FOUND,
  // PASSWORD_NOT_MATCHED,
  INVALID_OTP,
  OTP_MISMATCH
} = require('../constants');

module.exports = {
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
      return res.status(201).send(user);
    });
  },

  signin: (req, res) => {
    // All validations should be done by now!
    const { contact, otp, meta } = req.body;
    return async.waterfall([
      function findSeller(next) {
        Seller.findOne({ where: { contact } })
        .then(seller => {
          if (!seller) return res.notFound(SELLER_NOT_FOUND);
          return next(null, seller);
        })
        .catch(next);
      },
      // function validatePassword(seller, next) {
      //   return Seller.validatePassword(password, seller.password)
      //     .then(isValid => {
      //       if (isValid) return next(null, seller);
      //       return res.status(401).send(PASSWORD_NOT_MATCHED);
      //     })
      //     .catch(next);
      // },
      function validateOTP(user, next) {
        const criteria = {
          type: ACCOUNT_AUTHENTICATION,
          token: contact
        };
        return redisService.findOne(criteria)
        .then(value => {
          if (!value) return next(INVALID_OTP);
          if (parseInt(value.data, 10) !== otp) return next(OTP_MISMATCH);
          // Dont wait for this response
          redisService.destroy(criteria);
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
      return res.ok(seller);
    });
  },

  signout: (req, res) => {
    AccessToken.destroy({
      where: {
        token: getToken(req)
      }
    })
    .then(res.noContent)
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
