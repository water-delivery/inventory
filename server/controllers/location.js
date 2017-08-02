const Location = require('../models').location;

module.exports = {
  find: (req, res) => {
    const { city } = req.body || {};
    const criteria = {};
    if (city) criteria.city = city;
    return Location.findAndCountAll()
    .then(records => res.ok(records))
    .catch(res.negotiate);
  },

  create: (req, res) => {
    // All validation should be done by now
    const { name, pinCode, city, description } = req.body;
    Location.create({
      name,
      pinCode,
      city,
      description
    })
    .then(location => res.status(201).send(location))
    .catch(err => res.status(500).send(err));
  },

  update: (req, res) => {
    return res.status(200).send({
      message: 'Hello, World!!'
    })
  },
  delete: (req, res) => {
    return res.status(200).send({
      message: 'Hello, World!!'
    })
  },
}
