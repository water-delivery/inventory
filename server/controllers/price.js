const Price = require('../models').price;
const SellerProduct = require('../models').sellerProduct;
validations = {
  PRODUCT_NOT_FOUND: {
    message: 'Product not found for this seller in this location'
  }
}
module.exports = {
  /**
   * Seller should be able to add price for a specific product and location
   * @param  {[type]} req [description]
   * @param  {[type]} res [description]
   * @return {[type]}     [description]
   */
  create: (req, res) => {
    // All validations should happen before
    if (!req.options || !req.options.sellerProduct) {
      return res.notFound(validations.PRODUCT_NOT_FOUND);
    }
    const sellerProductId = req.options.sellerProduct.id;
    const { amount } = req.body;
    Price.create({
      sellerProductId,
      amount
    })
    .then(price => res.created(price))
    .catch(res.negotiate);
  },

  update: (req, res) => {
    // All validations should happen before
    if (!req.options || !req.options.sellerProduct) {
      return res.notFound(validations.PRODUCT_NOT_FOUND);
    }
    const sellerProductId = req.options.sellerProduct.id;
    const { amount } = req.body;

    Price.update({
      amount
    }, {
      where: { sellerProductId },
      returning: true,
      plain: true
    })
    .then(([affectedCount, affectedRows]) => res.created(affectedRows))
    .catch(res.negotiate);
  }

}
