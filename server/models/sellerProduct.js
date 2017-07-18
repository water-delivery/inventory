'use strict';
module.exports = function(sequelize, DataTypes) {
  var SellerProduct = sequelize.define('sellerProduct', {
    productId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: 'uniq_seller_product_location'
    },
    sellerId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: 'uniq_seller_product_location'
    },
    locationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: 'uniq_seller_product_location'
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
  return SellerProduct;
};
