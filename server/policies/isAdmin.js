const constants = require('../constants');

module.exports = (req, res, next) => {
  console.log('isAdmin Policy running');
  if (req.options && req.options.user.type === constants.USER_ADMIN) return next();

  return res.status(401).send(constants.AUTHENTICATION_NEEDED_AS_ADMIN);
};
