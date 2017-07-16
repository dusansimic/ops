const crypto = require('crypto');
const algorithm = 'aes-256-ctr';

module.exports.encrypt = (id, password) => {
  if (!password) return 'ERR: No password is set!';
  let cipher = crypto.createCipher(algorithm, password);
  let crypted = cipher.update(id, 'utf8', 'hex');
  crypted += cipher.final('hex');
  if (crypted) return crypted;
};

module.exports.decrypt = (id, password) => {
  if (!password) return 'ERR: No password is set!';
  let decipher = crypto.createDecipher(algorithm, password);
  let decrypted = decipher.update(id, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  if (decrypted) return decrypted;
};