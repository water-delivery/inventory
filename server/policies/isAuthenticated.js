const {
  USER_AUTHENTICATED,
  USER_ADMIN,
  AUTHENTICATION_NEEDED
} = require('../constants');

module.exports = (req, res, next) => {
  const authenticatedRoles = [
    USER_AUTHENTICATED,
    USER_ADMIN
  ];

  if (req.options && authenticatedRoles.includes(req.options.user.type)) return next();

  return res.status(401).send(AUTHENTICATION_NEEDED);
};
