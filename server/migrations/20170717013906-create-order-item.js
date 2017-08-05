'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('orderItems', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      sellerId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'sellers',
          key: 'id'
        }
      },
      productId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'products',
          key: 'id'
        }
      },
      orderId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'orders',
          key: 'id'
        }
      },
      status: {
        type: Sequelize.STRING
      },
      quantity: {
        type: Sequelize.INTEGER,
        defaultValue: 16,
        allowNull: false,
      },
      price: {
        type: Sequelize.INTEGER,
        validate: { min: 0 },
        allowNull: false
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
    return queryInterface.dropTable('orderItems');
  }
};
