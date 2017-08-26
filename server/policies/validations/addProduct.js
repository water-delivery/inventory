module.exports = (req, res, next) => {
  const { productId, priceMap } = req.body;
  if (!productId || isNaN(productId) ||
    !priceMap || priceMap.constructor !== Array || priceMap.length < 1
  ) {
    return res.badRequest({
      message: 'Required fields `productId`, `priceMap` missing or invalid'
    });
  }
  priceMap.forEach(({ amount, locationId }) => {
    if (!amount || !locationId || isNaN(locationId) || isNaN(amount)) {
      return res.badRequest({
        message: 'Required fields in `priceMap` array `amount`, `locationId` are invalid.'
      });
    }
  });
  return next();
};


// {
//   productId: 13,
//   priceMap: [{
//     amount: 12,
//     locationId: 1
//   }]
// }
