module.exports = (sequelize, DataTypes) => {
  const Reviews = sequelize.define('review', {
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 1, max: 5 },
    },
    feedback: {
      type: DataTypes.STRING,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING
    },
  }, {
    hooks: {
    }
  });

  Reviews.associate = (models) => {
    Reviews.belongsTo(models.product);
  };

  return Reviews;
};
