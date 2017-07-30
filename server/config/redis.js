module.exports = {
  redisKey: process.env.REDIS_KEY,
  redisHost: process.env.REDIS_HOST || '127.0.0.1',
  redisPort: process.env.REDIS_PORT || 6379,
};
