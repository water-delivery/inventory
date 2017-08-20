const rp = require('request-promise-native');
const config = require('../config');
const qs = require('qs');

module.exports = {
  /**
   * Get users from auth service
   * @return {[type]} [description]
   */
  getUsers: (ids = []) => {
    const userIds = ids.filter((val, idx, arr) => arr.indexOf(val) === idx);
    if (userIds.length < 1) return Promise.resolve([]);
    const options = {
      method: 'GET',
      url: `${config.urls.AUTH_SERVICE_HOST}/auth/v1/users?${qs.stringify({ id: userIds }, { indices: false })}`,
      auth: {
        user: config.credentials.auth.username,
        pass: config.credentials.auth.password
      },
      json: true
    };

    return rp(options);
  }
};
