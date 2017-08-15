const redis = require('redis');
const { generateUUID } = require('../utils');
const nconf = require('nconf');
const redisConfig = require('../config').redis;

nconf.argv().env().file('keys.json');

const redisClient = redis.createClient(
  nconf.get('redisPort') || redisConfig.redisPort,
  nconf.get('redisHost') || redisConfig.redisHost,
  {
    auth_pass: nconf.get('redisKey') || redisConfig.redisKey,
    return_buffers: true
  }
).on('error', (err) => console.error('ERR:REDIS:', err));

const typeMissingError = new Error('required parameter type missing');
const typeNotSupportedError = new Error('given type is not supported');
const tokenMissingError = new Error('required parameter token missing');
const dataMissingError = new Error('required parameter data missing');

const expirations = {
  vendorContactNumberVerification: 60 * 60, // 1 hour
  vendorAccountAuthentication: 60 * 60, // 1 hour
  emailVerification: 14 * 24 * 60 * 60, // 14 days
  accessToken: 300 // 5 min
};

const validTokenTypes = Object.keys(expirations);

/**
   * Creates entry in redis
   * @param {object} params
   * @param {object} user
   */
const create = ({ type, data, token = generateUUID() }) =>
  new Promise((resolve, reject) => {
    if (typeof type !== 'string') return reject(typeMissingError);
    if (!validTokenTypes.includes(type)) return reject(typeNotSupportedError);
    if (typeof type !== 'string') return reject(tokenMissingError);
    if (!data) return reject(dataMissingError);

    const expiration = expirations[type];

    const key = `${type}:${token}`;
    const value = {
      type,
      data,
      token
    };

    return redisClient.set(
      key,
      JSON.stringify(value),
      'EX',
      expiration,
      err => (err ? reject(err) : resolve(value))
    );
  });

const findOne = ({ type, token }) =>
  new Promise((resolve, reject) => {
    if (typeof type !== 'string') return reject(typeMissingError);
    if (!validTokenTypes.includes(type)) return reject(typeNotSupportedError);

    const key = `${type}:${token}`;

    return redisClient.get(key, (err, reply) => {
      let json;

      if (err) return reject(err);

      // if no entry was found resolve with undefined
      if (!reply) return resolve();

      try {
        json = JSON.parse(reply);
      } catch (e) {
        return reject(err);
      }

      return resolve(json);
    });
  });

const destroy = ({ type, token }) =>
  new Promise((resolve, reject) => {
    if (typeof type !== 'string') return reject(typeMissingError);
    if (typeof type !== 'string') return reject(tokenMissingError);

    const key = `${type}:${token}`;

    return redisClient.del(key, err => (err ? reject(err) : resolve()));
  });

module.exports = {
  create,
  findOne,
  destroy
};
