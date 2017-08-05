const Order = require('../models').order;
const OrderItem = require('../models').orderItem;

module.exports = {
  find: (req, res) => {
    const where = {};
    const sellerId = req.options || req.options.seller.id;
    const { locationId } = req.query || {};
    if (sellerId) where.sellerId = sellerId;
    if (locationId) where.locationId = locationId;

    return Order.findAndCountAll({
      where
    })
    .then(res.ok)
    .catch(res.negotiate);
  },

  findAll: (req, res) => {
    const { sellerId } = req.query || {};
    const where = {};
    if (sellerId && isFinite(sellerId)) where.sellerId = sellerId;
    return Order.findAndCountAll({
      where
    })
    .then(res.ok)
    .catch(res.negotiate);
  },

  findOne: (req, res) => {
    const { id } = req.params;
    const userId = req.options && req.options.user.id;
    return Order.findOne({
      where: {
        id,
        userId
      }
    })
    .then(res.ok)
    .catch(res.negotiate);
  },

  create: (req, res) => {
    const userId = req.options && req.options.user.id;
    const { slot, address, paymentMethod, items, locationId, landmark,
      expectedDeliveryDate, totalPrice } = req.body || {};
    return Order.create({
      userId,
      slot,
      address,
      landmark,
      locationId,
      paymentMethod,
      items,
      totalPrice,
      expectedDeliveryDate
    }, {
      include: [{
        model: OrderItem,
        as: 'items'
      }]
    })
    .then(res.created)
    .catch(res.negotiate);
  },

  update: (req, res) => res.status(200).send({ message: 'Hello, World!!' }),

  cancel: (req, res) => {
    const { id } = req.params;
    const { reason } = req.body || {};
    const userId = req.options.user.id;
    Order.update({
      cancelationReason: reason,
      cancelledAt: new Date()
    }, {
      where: {
        id,
        userId,
        cancelledAt: {
          $eq: null
        }
      },
      returning: true,
      plain: true
    })
    .then(([affectedCount, affectedRows]) => {
      if (affectedCount === 0) return res.notFound({ message: 'Order not found or already cancelled' });
      return res.ok(affectedRows);
    })
    .catch(res.negotiate);
  },

  delete: (req, res) => res.status(200).send({ message: 'Hello, World!!' }),
};
