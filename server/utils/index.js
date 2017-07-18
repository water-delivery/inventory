const crypto = require('crypto');

module.exports = {
  getToken: function (req) {
    var token;
    if (typeof req.query.access_token === 'string') {
      token = req.query.access_token;
    }

    if (typeof req.headers.authorization === 'string') {
      token = req.headers.authorization.split(' ')[1];
    }

    return token;
  },

  generateUUID: function () {
    return crypto
      .randomBytes(48)
      .toString('base64')
      .replace(/\//g, '_')
      .replace(/\+/g, '-');
  }
}
