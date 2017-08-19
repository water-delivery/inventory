const express = require('express');
const logger = require('./server/logger');
const bodyParser = require('body-parser');
const Router = require('./server/routes');
const responses = require('./server/responses');

const LOG_TYPE = process.env.LOG_TYPE || 'dev';

// Set up the express app
const app = express();

// Log requests to the console.
app.use(require('morgan')(LOG_TYPE, {
  stream: logger.stream
}));

global.logger = logger;

// Parse incoming requests data (https://github.com/expressjs/body-parser)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  req.options = req.options || {};
  req.options.deviceId = req.headers['device-id'];
  return next();
});

// Attaching custom response methods to res object
app.use(responses);

// Link routes
Router(app);

// Setup a default catch-all route that sends back a welcome message in JSON format.
app.get('*', (req, res) => res.status(404).send({
  message: 'Hey bro! you are all alone in this wide world.',
}));

module.exports = app;
