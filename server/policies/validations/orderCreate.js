/**
 *
{
  slot: 16,
  address: {},
  paymentMethod: 'COD',
  expectedDeliveryDate: '',
  items: [{
    productId: 1,
    sellerId: 12,
    quantity: 2
  }]
}
 */

const itemKeys = ['productId', 'sellerId', 'quantity', 'price'];
const orderKeys = [
  'locationId', 'slot', 'address', 'paymentMethod', 'landmark',
  'items', 'expectedDeliveryDate', 'totalPrice'
];

function isObjectValid(obj, keys) {
  return keys.every((item) => Object.keys(obj).includes(item));
}

module.exports = (req, res, next) => {
  const params = req.body || {};
  if (!params || !isObjectValid(params, orderKeys)) {
    return res.badRequest({
      message: `Required fields ${orderKeys.join(', ')} are not sent.`
    });
  }

  if (params.items.constructor !== Array ||
    params.items.length < 1) {
    return res.badRequest({
      message: 'items propery should be an array.'
    });
  }

  params.items.forEach(item => {
    if (!isObjectValid(item, itemKeys)) {
      return res.badRequest({
        message: `Required fields ${itemKeys.join(', ')} in 'items' prop are not sent.`
      });
    }

    return true;
  });

  return next();
};
