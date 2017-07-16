const http = require('http');
const request = require('request');
const unirest = require('unirest');
const io = require('socket.io-client');
const operation = require('./operation.js');

module.exports.makeTransfer = id => {
  let rawjsondata = {
    id: id
  };
  let jsondata = JSON.stringify(rawjsondata);
  let encrypted = operation.encrypt(jsondata, '1234');

  const socket = io.connect('http://localhost:9100');
  socket.emit('new transfer', encrypted);

  return null;
};