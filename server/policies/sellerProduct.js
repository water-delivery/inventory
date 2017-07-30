const SellerProduct = require('../models').sellerProduct;

module.exports = function (req, res, next) {
  req.options = req.options || {};
  const { sellerId } = req.params;
  const { productId, locationId } = req.body;
  if (!productId || isNaN(productId) ||
    !sellerId || isNaN(sellerId) ||
    !locationId || isNaN(locationId)
  ) {
      return res.badRequest({
        message: '`sellerId`, `productId` and `locationId` should be integers.'
      });
  }

  SellerProduct.findOne({
    where: {
      sellerId,
      productId,
      locationId
    },
    attributes: ['id', 'productId', 'sellerId', 'locationId', 'isActive']
  })
  .then(item => {
    req.options.sellerProduct = item;

    return next();
  })
  .catch(next);
}
