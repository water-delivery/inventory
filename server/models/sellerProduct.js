module.exports = (sequelize, DataTypes) => {
  const SellerProduct = sequelize.define('sellerProduct', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
      unique: true
    },
    productId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sellerId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    locationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false
    }
  }, {
    freezeTableName: true
  });

  SellerProduct.associate = (models) => {
    SellerProduct.hasOne(models.price);
    SellerProduct.belongsTo(models.product);
    SellerProduct.belongsTo(models.seller);
    SellerProduct.belongsTo(models.location);
  };

  return SellerProduct;
};
