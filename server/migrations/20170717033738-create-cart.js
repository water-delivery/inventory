'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('carts', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: 'unique_user_product'
      },
      productId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: 'unique_user_product'
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
    return queryInterface.dropTable('carts');
  }
};
