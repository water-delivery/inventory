const constants = require('../constants');
const { getToken } = require('../utils');
const AccessToken = require('../models').accessToken;
const Seller = require('../models').seller;

module.exports = (req, res, next) => {
  req.options = req.options || {};
  const token = getToken(req);
  if (!token) {
    return res.unAuthorized(constants.ACCESS_TOKEN_NOT_FOUND);
  }

  return AccessToken.findOne({
    where: { token },
    include: [{
      model: Seller,
      required: true,
      attributes: ['firstName', 'lastName', 'avatar', 'contact', 'description', 'email', 'roles']
    }]
  })
  .then(record => {
    if (!record) res.unAuthorized(constants.ACCESS_TOKEN_INVALID);
    req.options.user = record.user;
    req.options.user.type = record.user.roles === 'admin'
     ? constants.USER_ADMIN
     : constants.USER_AUTHENTICATED;
    next();
  })
  .catch(next);
};
