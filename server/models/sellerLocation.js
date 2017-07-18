'use strict';
module.exports = function(sequelize, DataTypes) {
  var SellerLocation = sequelize.define('sellerLocation', {
    sellerId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: 'uniq_seller_location'
    },
    locationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: 'uniq_seller_location'
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false
    }
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return SellerLocation;
};
