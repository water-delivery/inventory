/**
 *
 * @params: orderId
  Body {
    reason: 1,
    feedback: '',
  }
 */

const expectedKeys = ['reason'];

function isObjectValid(obj, keys) {
  return keys.every((item) => Object.keys(obj).includes(item));
}

module.exports = (req, res, next) => {
  const params = req.body || {};
  if (!params || !isObjectValid(params, expectedKeys)) {
    return res.badRequest({
      message: `Required fields ${expectedKeys.join(', ')} are not sent.`
    });
  }

  return next();
};
