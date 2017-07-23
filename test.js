const operation = require('./operation.js');
const transfer = require('./transfer.js');

let transferReq = {
  action: 'transfer',
  senderId: 'f024jf48902h5f02',
  transferSum: 99.99
};

let enc = operation.encrypt(JSON.stringify(transferReq), '1234');

transfer.makeTransfer(null, null, enc);