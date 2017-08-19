const rp = require('request-promise-native');
const config = require('../config');
const qs = require('qs');

module.exports = {
  /**
   * Get users from auth service
   * @return {[type]} [description]
   */
  getUsers: (ids = []) => {
    const userIds = ids.filter(id => id.isFinite(id));
    const options = {
      method: 'GET',
      url: `${config.urls.AUTH_SERVICE_HOST}/auth/v1/users?${qs.stringify(userIds)}`,
      auth: {
        user: config.credentials.auth.username,
        pass: config.credentials.auth.password
      },
      json: true
    };

    return rp(options);
  }
};
