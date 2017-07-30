'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('accessTokens', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      token: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      sellerId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      device: {
        type: Sequelize.STRING
      },
      location: {
        type: Sequelize.STRING
      },
      latitude: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: null,
        validate: { min: -90, max: 90 }
      },
      longitude: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: null,
        validate: { min: -180, max: 180 }
      },
      ip: {
        type: Sequelize.STRING,
        validate: {
          isIP: true,
        },
        allowNull: true
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
    return queryInterface.dropTable('accessTokens');
  }
};
