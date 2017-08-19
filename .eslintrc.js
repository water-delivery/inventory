const fs = require('fs');

const config = {
  "extends": "airbnb",
  "rules": {
    // disable requiring trailing commas because it might be nice to revert to
    // being JSON at some point, and I don't want to make big changes now.
    "comma-dangle": 0,
    "arrow-parens": 0
  },
  "env": {
    "node": true,
    "mocha": true
  },
  "globals": {
    "logger": true
  }
};
console.log('models path', `${__dirname}/server/models`);
const models = fs.readdirSync(`${__dirname}/server/models`)
  .filter(f => !f.includes('index') && f.includes('.js'))
  .map(f => f.replace('.js', ''));

models.forEach(model => {
  config.globals[model] = true;
});

module.exports = config;
