module.exports = (sequelize, DataTypes) => {
  const OrderItem = sequelize.define('orderItem', {
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    sellerId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING
    },
    quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      allowNull: false,
    },
    price: {
      type: DataTypes.INTEGER,
      validate: { min: 0 },
      allowNull: false
    }
  });

  OrderItem.associate = (models) => {
    OrderItem.belongsTo(models.order);
    OrderItem.belongsTo(models.product);
  };

  return OrderItem;
};
