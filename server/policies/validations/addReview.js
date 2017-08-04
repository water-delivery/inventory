module.exports = (req, res, next) => {
  const { rating, productId } = req.body || {};
  if (!rating || !productId) {
    return res.badRequest({
      message: 'Required fields `rating` or `productId` not sent'
    });
  }
  return next();
};
