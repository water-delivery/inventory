const crypto = require('crypto');

module.exports = {
  getToken: (req) => {
    let token;
    if (typeof req.query.access_token === 'string') {
      token = req.query.access_token;
    }

    if (typeof req.headers.authorization === 'string') {
      token = req.headers.authorization.split(' ')[1];
    }

    return token;
  },

  generateUUID: () => crypto
    .randomBytes(48)
    .toString('base64')
    .replace(/\//g, '_')
    .replace(/\+/g, '-'),

  generateRandomNumber: (length = 4) => {
    if (length > 10) return undefined;
    // const offset = (10 ** (length - 1));
    const offset = Math.pow(10, length - 1);
    const min = offset;
    const max = 9 * offset;
    return Math.floor(min + (Math.random() * max));
  },

  generateOTPTextMessage: (otp) => {
    const filler = process.env.OTP_TEXT_MESSAGE_FILLER ||
      '  is your OTP for your account verification.';
    return `Hello vendor, ${otp}${filler}`;
  },

  isObjectValid: (obj, keys) => keys.every((item) => Object.keys(obj).includes(item))

};
