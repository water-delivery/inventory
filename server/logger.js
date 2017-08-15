const winston = require('winston');
const { notification } = require('./services');

const config = {
  levels: {
    error: 0,
    debug: 1,
    warn: 2,
    data: 3,
    info: 4,
    verbose: 5,
    silly: 6
  },
  colors: {
    error: 'red',
    debug: 'blue',
    warn: 'yellow',
    data: 'grey',
    info: 'green',
    verbose: 'cyan',
    silly: 'magenta'
  }
};

function ignoreEpipe(err) {
  const exitOnError = err.code !== 'EPIPE';
  if (exitOnError &&
    notification &&
    typeof notification.appCrashes === 'function') notification.appCrashes(err);
  return exitOnError;
}

const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      colorize: true,
      level: 'silly',
      json: true
    })
  ],
  levels: config.levels,
  colors: config.colors,
  exitOnError: ignoreEpipe
});

logger.info('Winston logger configured successfully');
module.exports = logger;

module.exports.stream = {
  write: (message) => {
    logger.info(message);
  }
};
