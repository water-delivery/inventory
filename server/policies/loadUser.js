const request = require('request');
const constants = require('../constants');
const { getToken } = require('../utils');
const urls = require('../config').urls;

module.exports = (req, res, next) => {
  req.options = req.options || {};

  // start with setting user to UNAUTHENTICATED
  req.options.user = { type: constants.USER_UNAUTHENTICATED };

  const accessToken = getToken(req);
  // no accessToken and not a service account
  // go forward as UNAUTHENTICATED user
  if (!accessToken) return next();

  const authServiceReqOptions = {
    method: 'GET',
    url: `${urls.api}/auth/me`,
    headers: { Authorization: `Bearer ${accessToken}` },
    json: true
  };

  return request(authServiceReqOptions, (err, response, body) => {
    const errorMessage = err || (response && response.body);
    const statusCode = (response && response.statusCode) || 500;

    if (err || statusCode !== 200) {
      return res
        .status(statusCode)
        .json(errorMessage || { message: 'Request to auth-service failed' });
    }

    req.options.user = body;
    req.options.user.type = req.options.user.isAdmin
     ? constants.USER_ADMIN
     : constants.USER_AUTHENTICATED;

    return next();
  });
};
