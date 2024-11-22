const crypto = require('crypto');

const generateSalt = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

const apiTokenSalt = generateSalt();
console.log(apiTokenSalt);