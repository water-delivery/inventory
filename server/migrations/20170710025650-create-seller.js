'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('sellers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      firstName: {
        type: Sequelize.STRING
      },
      lastName: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING,
        validate: { min: 6 },
        allowNull: false
      },
      avatar: {
        type: Sequelize.STRING
      },
      contact: {
        type: Sequelize.STRING,
        unique: true,
        isNumeric: true,
        max: 10,
        allowNull: false,
      },
      contactSecondary: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      verifiedAt: {
        type: Sequelize.DATE
      },
      roles: {
        type: Sequelize.ENUM,
        values: ['seller', 'admin'],
        defaultValue: 'seller'
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
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('sellers');
  }
};
