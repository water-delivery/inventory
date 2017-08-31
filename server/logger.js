const winston = require('winston');
const { notification } = require('./services');
const { LOG_DIR } = require('./config').paths;
const fs = require('fs');
const path = require('path');

if (!fs.existsSync(LOG_DIR)) {
  // Create the directory if it does not exist
  fs.mkdirSync(LOG_DIR);
}

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
      json: true,
    }),
    new (winston.transports.File)({
      filename: path.join(LOG_DIR, '/inventory-all-logs.log'),
      level: 'info',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      tailable: true,
      json: false
    }),
  ],
  levels: config.levels,
  colors: config.colors,
  exitOnError: ignoreEpipe
});

winston.handleExceptions(new winston.transports.Console({
  colorize: true,
  level: 'debug',
  json: false,
  humanReadableUnhandledException: true
}));

winston.handleExceptions(new winston.transports.File({
  filename: path.join(LOG_DIR, '/inventory-uncaughtExceptions.log'),
  maxsize: 5242880, // 5MB
  maxFiles: 5,
}));

logger.info('Winston logger configured successfully');

module.exports = logger;

module.exports.stream = {
  write: (message) => {
    logger.info(message);
  }
};
