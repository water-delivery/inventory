'use strict';
module.exports = function(sequelize, DataTypes) {
  var Location = sequelize.define('location', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pinCode: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false
    },
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });

  Location.associate = (models) => {
    // Location.belongsToMany(models.seller, {
    //   through: 'sellerProduct'
    // });
  };
  return Location;
};
