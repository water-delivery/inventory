'use strict';
module.exports = function(sequelize, DataTypes) {
  var SellerProduct = sequelize.define('sellerProduct', {
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
    SellerProduct.belongsTo(models.product);
    SellerProduct.belongsTo(models.seller);
    SellerProduct.belongsTo(models.location);
  };

  return SellerProduct;
};
