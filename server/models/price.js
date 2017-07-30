'use strict';
module.exports = function(sequelize, DataTypes) {
  var Price = sequelize.define('price', {
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
      associate: function(models) {
        // associations can be defined here
      }
    }
  });

  Price.associate = (models) => {
    // Price.belongsTo(models.sellerProduct);
    Price.belongsTo(models.sellerProduct, { as: 'sellerProduct' });
  };
  return Price;
};
