const Review = require('../models').review;

module.exports = {
  create: (req, res) => {
    const { feedback, rating, firstName, productId } = req.body;
    const userId = req.options.user.id;
    Review.create({
      userId,
      feedback,
      rating,
      firstName,
      productId
    })
    .then(record => res.created(record))
    .catch(res.negotiate);
  },

  find: (req, res) => {
    const { productId } = req.query || {};
    if (!productId || isNaN(productId)) {
      return res.badRequest({ message: 'Required params product id is required' });
    }
    return Review.findAll({
      where: {
        productId
      }
    })
    .then(res.ok)
    .catch(res.negotiate);
  },

  findOne: (req, res) => {
    const userId = req.options.user.id;
    const { productId } = req.query || {};
    if (!userId || isNaN(userId)) {
      return res.badRequest({ message: 'User should be logged to get his review' });
    }
    return Review.findOne({
      where: {
        userId,
        productId
      }
    })
    .then(res.ok)
    .catch(res.negotiate);
  },

  delete: (req, res) => {
    const { id } = req.params;
    const userId = req.options.user.id;
    if (isNaN(id)) return res.badRequest({ message: 'id should be an integer' });
    return Review.findOne({
      where: { userId, id }
    })
    .then(Review.destroy({ id }))
    .then(res.noContent)
    .catch(res.negotiate);
  }
};
