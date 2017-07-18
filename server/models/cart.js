'use strict';
module.exports = function(sequelize, DataTypes) {
  var Cart = sequelize.define('cart', {
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: 'unique_user_product'
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: 'unique_user_product'
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    }
  }, {
  });

  return Cart;
};
