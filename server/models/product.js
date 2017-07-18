'use strict';
module.exports = function(sequelize, DataTypes) {
  var Product = sequelize.define('product', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    avatar: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 20
    },
    meta: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    verifiedAt: {
      type: DataTypes.DATE
    },
    verifiedBy: {
      type: DataTypes.STRING
    }
  }, {
    hooks: {

    }
  });

  Product.associate = (models) => {
    Product.belongsToMany(models.seller, {
      through: 'sellerProduct',
      as: 'sellers'
    });
  };
  return Product;
};
