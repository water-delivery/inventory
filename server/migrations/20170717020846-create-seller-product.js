'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('sellerProduct', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      productId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: 'uniq_seller_product_location'
      },
      sellerId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: 'uniq_seller_product_location'
      },
      locationId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: 'uniq_seller_product_location'
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
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
    return queryInterface.dropTable('sellerProduct');
  }
};
