module.exports = {
  api: process.env.API || 'http://api.arkraiders.dev',
  AUTH_SERVICE_HOST: process.env.AUTH_SERVICE_HOST
    ? 'http://' + process.env.AUTH_SERVICE_HOST
    : 'http://api.arkraiders.dev',
  NOTIFICATIONS_SERVICE_HOST: process.env.NOTIFICATIONS_SERVICE_HOST
    ? 'http://' + process.env.NOTIFICATIONS_SERVICE_HOST
    : 'http://api.arkraiders.dev',
};
