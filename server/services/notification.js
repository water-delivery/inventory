const request = require('request');
const rp = require('request-promise-native');
const plivoConfig = require('../config').plivo;
const config = require('../config');

module.exports = {
  sendOTP: (text, contact, countryCode = 91) => {
    const params = {
      src: plivoConfig.senderId,
      dst: `${countryCode}${contact}`, // Receiver's phone Number with country code
      text,
    };

    // Validate here!
    const options = {
      method: 'POST',
      url: `${config.urls.api}/notification/v1/sms`,
      auth: {
        user: config.credentials.notification.username,
        pass: config.credentials.notification.password
      },
      json: params
    };

    return new Promise((resolve, reject) => {
      request(options, (err, response, body) => {
        const errorMessage = err || (response && response.body);
        if (response && response.statusCode >= 400) return reject({ errorMessage, response });
        let jsonBody = {};
        try {
          jsonBody = JSON.parse(body);
        } catch (e) {
          jsonBody = null;
        }
        return resolve(jsonBody);
      });
    });
  },

  notify: (params) => {
    // Validate here!
    const options = {
      method: 'POST',
      url: `${config.urls.api}/notification/v1/notify`,
      auth: {
        user: config.credentials.notification.username,
        pass: config.credentials.notification.password
      },
      json: params
    };
    return rp(options);
  },

  /**
   * TODO: Send text message when app is about to crash
   * @return {[type]} [description]
   */
  appCrashes: (error) => {
    // Validate here!
    const options = {
      method: 'POST',
      url: `${config.urls.api}/notification/v1/logger/crash`,
      auth: {
        user: config.credentials.notification.username,
        pass: config.credentials.notification.password
      },
      json: {
        error
      }
    };

    return rp(options);
  }
};
