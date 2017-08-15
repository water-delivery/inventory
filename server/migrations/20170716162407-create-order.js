'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('orders', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM,
        values: ['processing', 'dispatched', 'delivered', 'cancelled'],
        defaultValue: 'processing',
        allowNull: false,
      },
      slot: {
        type: Sequelize.INTEGER,
        defaultValue: 16,
        allowNull: false,
      },
      address: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      addressLine1: {
        type: Sequelize.STRING,
      },
      addressLine2: {
        type: Sequelize.STRING,
      },
      landmark: {
        type: Sequelize.STRING,
        allowNull: false
      },
      locationId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'locations',
          key: 'id'
        }
      },
      totalPrice: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      paymentMethod: {
        type: Sequelize.ENUM,
        values: ['COD', 'PREPAID'],
        defaultValue: 'COD',
        allowNull: false,
      },
      expectedDeliveryDate: {
        type: Sequelize.DATE,
        allowNull: false
      },
      actualDeliveryDate: {
        type: Sequelize.DATE
      },
      cancelledAt: {
        type: Sequelize.DATE
      },
      cancelationReason: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('orders');
  }
};
