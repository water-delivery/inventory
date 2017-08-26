module.exports = (sequelize, DataTypes) => {
  const Location = sequelize.define('location', {
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
    }
  });

  Location.associate = (models) => {
    // Location.belongsToMany(models.seller, {
    //   through: 'sellerProduct'
    // });
  };
  return Location;
};
