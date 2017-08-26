const Price = require('../models').price;
const SellerProduct = require('../models').sellerProduct;

const validations = {
  PRODUCT_NOT_FOUND: {
    message: 'Product not found for this seller in this location'
  }
};

module.exports = {
  add: (req, res) => {
    const sellerId = req.params.sellerId;
    const { productId, priceMap } = req.body || {};
    const sellerProducts = [];
    priceMap.forEach(({ amount, locationId }) => {
      sellerProducts.push({
        sellerId,
        productId,
        locationId,
        price: {
          amount
        }
      });
    });

    SellerProduct.bulkCreate(sellerProducts)
    .then(sellerProduct => {
      return res.created(sellerProduct);
    })
    .catch(res.negotiate);
  },

  /**
   * Seller should be able to add an existing product to his catalog
   * @param  {[type]} req [description]
   * @param  {[type]} res [description]
   * @return {[type]}     [description]
   */
  addProduct: (req, res) => {
    // All validations should happen before
    const sellerId = req.params.sellerId;
    const { productId, locationId } = req.body || {};
    SellerProduct.create({
      sellerId,
      locationId,
      productId
    })
    .then(sellerProduct => res.created(sellerProduct))
    .catch(res.negotiate);
  },

  /**
   * Seller should be able to add price for a specific product and location
   * @param  {[type]} req [description]
   * @param  {[type]} res [description]
   * @return {[type]}     [description]
   */
  addPrice: (req, res) => {
    // All validations should happen before
    if (!req.options || !req.options.sellerProduct) {
      return res.notFound(validations.PRODUCT_NOT_FOUND);
    }
    const sellerProductId = req.options.sellerProduct.id;
    const { amount } = req.body;
    return Price.create({
      sellerProductId,
      amount
    })
    .then(price => res.created(price))
    .catch(res.negotiate);
  },

  updatePrice: (req, res) => {
    // All validations should happen before
    if (!req.options || !req.options.sellerProduct) {
      return res.notFound(validations.PRODUCT_NOT_FOUND);
    }
    const sellerProductId = req.options.sellerProduct.id;
    const { amount } = req.body;

    return Price.update({
      amount
    }, {
      where: { sellerProductId },
      returning: true,
      plain: true
    })
    .then(([affectedCount, affectedRows]) => res.created(affectedRows))
    .catch(res.negotiate);
  }
};
