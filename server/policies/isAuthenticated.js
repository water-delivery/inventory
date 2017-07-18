const constants = require('../constants');
module.exports = function (req, res, next) {

  if (req.options && req.options.user.type === constants.USER_AUTHENTICATED) return next();

  return res.status(401).send(constants.AUTHENTICATION_NEEDED);
}
