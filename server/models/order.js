'use strict';
module.exports = function(sequelize, DataTypes) {
  var Order = sequelize.define('order', {
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 20
    },
    slot: {
      type: DataTypes.INTEGER,
      defaultValue: 16,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    totalPrice: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    paymentMethod: {
      type: DataTypes.ENUM,
      values: ['COD', 'PREPAID'],
      defaultValue: 'COD',
      allowNull: false,
    },
    expectedDeliveryDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    actualDeliveryDate: {
      type: DataTypes.DATE
    }
  }, {
  });

  Order.associate = (models) => {
    Order.hasMany(models.orderItem);
  }
  return Order;
};
