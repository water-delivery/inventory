const bcrypt = require('bcrypt');
const config = require('../config');

module.exports = function(sequelize, DataTypes) {
  var Seller;
  Seller = sequelize.define('seller', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    avatar: DataTypes.STRING,
    password: {
      type: DataTypes.STRING,
      validate: { min: 6 },
      allowNull: false
    },
    contact: {
      type: DataTypes.STRING,
      unique: true,
      isNumeric: true,
      max: 10,
      allowNull: false,
    },
    contactSecondary: DataTypes.STRING,
    description: DataTypes.STRING,
    email: DataTypes.STRING,
    verifiedAt: {
      type: DataTypes.DATE
    }
  }, {
    hooks: {
      beforeCreate: (seller, options) => {
        return Seller.hashPassword(seller.password).then(hashedPw => {
          seller.password = hashedPw;
        });
      },
      beforeUpdate: (seller, options) => {
        if (!seller.password) return;
        return Seller.hashPassword(seller, (err, hash) => {
          seller.password = hash;
        });
      },
      afterCreate: () => {
        // Do stuff like logging, sending notifications or emails
      }
    },
    getterMethods: {
      fullName: function () {
        return this.getDataValue('firstName') + ' ' + this.getDataValue('lastName');
      }
    }
  });

  Seller.associate = (models) => {
    Seller.hasMany(models.accessToken, {
      onDelete: 'cascade',
      hooks: true,
      as: 'tokens'
    });

    Seller.hasMany(models.location, {
      as: 'locations'
    });

    Seller.belongsToMany(models.product, {
      through: 'sellerProduct',
      as: 'products'
    });

    Seller.hasMany(models.orderItem, {
      as: 'orderItems'
    });
  };

  Seller.validatePassword = (password, hash) => {
    return new Promise((resolve, reject) =>
      bcrypt.compare(
        password,
        hash,
        (err, isValid) => (err ? reject(err) : resolve(isValid))
      )
    );
  };

  Seller.hashPassword = (password) => {
    return new Promise((resolve, reject) =>
      bcrypt
        .hash(password, config.bcrypt.rounds)
        .then(hash => resolve(hash))
        .catch(err => reject())
    );
  };
  return Seller;
};
