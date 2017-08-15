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
    plain: true,
    include: [{
      model: Seller,
      required: true,
      plain: true,
      attributes: ['id', 'firstName', 'lastName', 'avatar', 'contact', 'description', 'email', 'roles']
    }]
  })
  .then(record => {
    if (!record) return res.unAuthorized(constants.ACCESS_TOKEN_INVALID);
    req.options.seller = record.seller;
    req.options.seller.type = record.seller.roles === 'admin'
     ? constants.USER_ADMIN
     : constants.USER_AUTHENTICATED;

    return next();
  })
  .catch(next);
};
