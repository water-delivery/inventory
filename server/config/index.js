const bcrypt = require('./bcrypt');
const connections = require('./connections');
const redis = require('./redis');
const plivo = require('./plivo');
const urls = require('./urls');

module.exports = {
  bcrypt,
  connections,
  redis,
  plivo,
  urls,
  credentials: {
    notification: {
      username: 'arkraiders',
      password: process.env.NOTIFICATION_SERVICE_BASIC_AUTH || 'notification'
    },
    auth: {
      username: 'arkraiders',
      password: process.env.NOTIFICATION_SERVICE_BASIC_AUTH || 'auth'
    }
  },
  paths: {
    LOG_DIR: process.env.LOG_DIR || './logs'
  }
};
