const Sequelize = require('../models').Sequelize;
const Product = require('../models').product;
const Order = require('../models').order;
const OrderItem = require('../models').orderItem;
const NotificationService = require('../services').notification;
const CustomerService = require('../services').customer;
const async = require('async');

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

  findSellerOrders: (req, res) => {
    const sellerId = req.options.seller && req.options.seller.id;
    const { locationId, status, period } = req.query || {};
    const where = {};
    const currentDate = new Date();
    const dd = currentDate.getDate();
    const mm = currentDate.getMonth();
    const yyyy = currentDate.getFullYear();

    // const today = new Date(yyyy, mm, dd);
    const yesterday = new Date(yyyy, mm, dd - 1);
    const before = new Date(yyyy, mm, dd - 2);
    const tomorrow = new Date(yyyy, mm, dd + 1);
    const later = new Date(yyyy, mm, dd + 2);
    const periodMap = {
      today: {
        $gt: yesterday,
        $lt: tomorrow
      },
      tomorrow: {
        $gt: tomorrow,
        $lt: later
      },
      yesterday: {
        $lt: yesterday,
        $gt: before,
      },
      later: {
        $gt: later
      },
      before: {
        $lt: before
      },
    };
    const statusMap = {
      upcoming: 'processing',
      pending: ['processing', 'dispatched'],
      delivered: 'delivered',
      cancelled: 'cancelled'
    };

    if (period && !periodMap[period]) {
      return res.badRequest('Unsupported query param `period` is sent.');
    }
    if (status && !statusMap[status]) {
      return res.badRequest('Unsupported query param `status` is sent.');
    }

    if (status) where.status = statusMap[status];
    if (period) where.expectedDeliveryDate = periodMap[period];

    if (locationId && isNaN(locationId)) {
      return res.badRequest({
        message: 'Location in query params should be an integer'
      });
    }
    if (locationId) where.locationId = parseInt(locationId, 10);
    return Order.findAndCountAll({
      where,
      include: [{
        model: OrderItem,
        where: { sellerId },
        attributes: ['id', 'status', 'quantity', 'price'],
        include: [{
          model: Product,
          attributes: ['id', 'name', 'avatar', 'description', 'capacity']
        }],
        as: 'items',
        required: true,
      }]
    })
    .then(({ count, rows }) => {
      const orders = rows;
      const userIds = orders.map(order => order.userId);
      CustomerService.getUsers(userIds)
      .then(users => {
        const userMap = {};
        users.forEach(user => {
          userMap[user.id] = user;
        });
        // const updatedOrders = orders;
        orders.forEach((order, idx) => {
          orders[idx].user = userMap[order.userId];
          delete orders[idx].userId;
        });
        return res.ok({
          count,
          orders
        });
      })
      .catch(res.negotiate);
    })
    .catch(res.negotiate);
  },

  getOrderStats: (req, res) => {
    const sellerId = req.options.seller.id;
    async.parallel([
      // Delivered
      (cb) =>
        OrderItem.findAll({
          attributes: [[Sequelize.fn('COUNT', Sequelize.col('orderItem.id')), 'count']],
          where: { sellerId },
          include: [{
            model: Order,
            where: { status: 'delivered' },
            required: true,
            attributes: []
          }],
          group: ['orderItem.id']
        })
        .then(([row]) => cb(null, row))
        .catch(cb),
      // Upcoming
      (cb) =>
        OrderItem.findAll({
          attributes: [[Sequelize.fn('COUNT', Sequelize.col('orderItem.id')), 'count']],
          where: { sellerId },
          include: [{
            model: Order,
            where: {
              status: 'processing',
              expectedDeliveryDate: {
                $gt: Date.now()
              }
            },
            required: true,
            attributes: []
          }],
          group: ['orderItem.id']
        })
        .then(([row]) => cb(null, row))
        .catch(cb),
      // Pending
      (cb) =>
        OrderItem.findAll({
          attributes: [[Sequelize.fn('COUNT', Sequelize.col('orderItem.id')), 'count']],
          where: { sellerId },
          include: [{
            model: Order,
            where: {
              status: 'processing',
              expectedDeliveryDate: {
                $lt: Date.now()
              }
            },
            required: true,
            attributes: []
          }],
          group: ['orderItem.id']
        })
        .then(([row]) => cb(null, row))
        .catch(cb),
      // Cancelled
      (cb) =>
        OrderItem.findAll({
          attributes: [[Sequelize.fn('COUNT', Sequelize.col('orderItem.id')), 'count']],
          where: { sellerId },
          include: [{
            model: Order,
            where: {
              status: 'cancelled'
            },
            required: true,
            attributes: []
          }],
          group: ['orderItem.id']
        })
        .then(([row]) => cb(null, row))
        .catch(cb),
    ], (err, [delivered, upcoming, pending, cancelled]) => {
      if (err) return res.negotiate(err);
      return res.ok({
        delivered: (delivered && delivered.get('count')) || 0,
        upcoming: (upcoming && upcoming.get('count')) || 0,
        pending: (pending && pending.get('count')) || 0,
        cancelled: (cancelled && cancelled.get('count')) || 0
      });
    });
  },

  findUserOrders: (req, res) => {
    const userId = req.options.user.id;
    return Order.findAndCountAll({
      where: {
        userId
      },
      include: [{
        model: OrderItem,
        include: [{
          model: Product,
          attributes: ['id', 'name', 'avatar', 'description', 'capacity']
        }],
        as: 'items',
        required: true,
      }]
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
    const { slot, address, addressLine1, addressLine2, paymentMethod, items, locationId, landmark,
      expectedDeliveryDate, totalPrice } = req.body || {};
    return Order.create({
      userId,
      slot,
      address,
      addressLine1,
      addressLine2,
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
    .then(record => {
      // Notify merchant
      NotificationService.notify({
        type: 'seller',
        action: 'orderPlaced',
        deviceId: req.options.deviceId,
        userId: items.map(item => item.sellerId),
        meta: {
          address,
          landmark
        }
      });
      // Notify user
      NotificationService.notify({
        type: 'user',
        action: 'orderConfirmation',
        deviceId: req.options.deviceId,
        userId,
        meta: {
          address,
          landmark
        }
      });
      return res.created(record);
    })
    .catch(res.negotiate);
  },

  update: (req, res) => res.status(200).send({ message: 'Hello, World!!' }),

  cancel: (req, res) => {
    const { id } = req.params;
    const { reason } = req.body || {};
    const userId = req.options.user.id;
    Order.update({
      cancelationReason: reason,
      status: 'cancelled',
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
