module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('order', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM,
      values: ['processing', 'dispatched', 'delivered', 'cancelled'],
      defaultValue: 'processing',
      allowNull: false,
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
    addressLine1: {
      type: DataTypes.STRING,
    },
    addressLine2: {
      type: DataTypes.STRING,
    },
    landmark: {
      type: DataTypes.STRING,
      allowNull: false
    },
    locationId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    totalPrice: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    cancelledAt: {
      type: DataTypes.DATE
    },
    cancelationReason: {
      type: DataTypes.STRING
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
    Order.hasMany(models.orderItem, { as: 'items' });
    // Order.belongsTo(models.orderItem, { as: 'items' });
  };

  return Order;
};
