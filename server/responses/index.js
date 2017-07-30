const ok = require('./ok');
const created = require('./created');
const serverError = require('./serverError');
const negotiate = require('./negotiate');
const notFound = require('./notFound');
const noContent = require('./noContent');
const unAuthorized = require('./unAuthorized');

module.exports = (req, res, next) => {
  res.ok = ok(res);
  res.created = created(res);
  res.serverError = serverError(res);
  res.negotiate = negotiate(res);
  res.notFound = notFound(res);
  res.noContent = noContent(res);
  res.unAuthorized = unAuthorized(res);
  next();
};
