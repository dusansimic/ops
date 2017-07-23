const MongoClient = require('mongodb').MongoClient;

const dbUrl = 'mongodb://localhost:27017/ops';

const findUsersSync = (db, queryObject) => {
  let returnArray = null;
  let cursor = db.collection('users').find(queryObject).toArray((err, docs) => {
    if (err) throw err;
    console.log(docs);
    returnArray = (docs === []) ? null : docs;
  });
  return returnArray;
};

const findUserSync = (db, queryObject) => {
  let returnObject = null;
  db.collection('users').findOne(queryObject).toArray((err, doc) => {
    if (err) throw err;
    returnObject = doc;
  });
  return returnObject;
};

const insertUserSync = (db, doc) => {
  db.collection('users').insertOne(doc, (err, result) => {
    if (err) throw err;
    return result;
  });
};

module.exports.addAccount = data => {
  MongoClient.connect(dbUrl, (err, db) => {
    if (err) throw err;
    console.log((new Date()) + ' Adding new account!');
    let queryObj = { accountId: data.accountId };
    let accountsArr = findUsersSync(db, queryObj);
    if (!accountsArr) {
      let account = {
        accountId: data.accountId,
        balance: 0.00
      }
      let res = insertUserSync(db, account);
      console.log(res);
    };
    db.close();
  });
};

module.exports.transferMoney = data => {
  MongoClient.connect(dbUrl, (err, db) => {
    if (err) throw err;
    console.log((new Date()) + ' Connected to database!');

    let queryObj = { accountId: data.senderId };
    let account = findUserSync(db, queryObj);
    let bank = findUserSync(db, { accountId: 'bank' });
    if (!account)
      return console.error('Source account does not exist!');
    if (account.balance < data.transferSum)
      return console.error('Source account does not have enough fonds.');
    if (!bank)
      return console.error('Bank is not connected!');
    account.balance -= data.transferSum;
    bank.balance += data.transferSum;

    db.close();
    return true;
  });
};