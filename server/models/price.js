module.exports = (sequelize, DataTypes) => {
  const Price = sequelize.define('price', {
    sellerProductId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true
    },
    // sellerId: {
    //   type: DataTypes.INTEGER,
    //   allowNull: false,
    // },
    // locationId: {
    //   type: DataTypes.INTEGER,
    //   allowNull: false,
    // },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
  }, {
    classMethods: {
    }
  });

  Price.associate = (models) => {
    Price.belongsTo(models.sellerProduct);
    // Price.belongsTo(models.sellerProduct, { as: 'sellerProduct' });
  };
  return Price;
};
