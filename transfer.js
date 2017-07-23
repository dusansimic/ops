const http = require('http');
const WebSocketClient = require('websocket').client;
const operation = require('./operation.js');

module.exports.makeTransfer = (senderId, transferAmount, rawjsondata) => {
  /*let rawjsondata = {
    sender: senderId,
    amount: transferAmount
  };*/
  /*let encrypted = operation.encrypt(JSON.stringify(rawjsondata), '1234');*/

  let encrypted = rawjsondata;

  let client = new WebSocketClient();

  client.on('connectionFailed', err => {
    if (err) throw err;
  });

  client.on('connect', conn => {
    let stop = false;

    conn.on('error', err => {
      if (err) throw err;
    });
    conn.on('close', () => {
      console.log('Connection closed.');
    });
    conn.on('message', msg => {
      if (msg.type === 'utf8') {
        console.log(msg.utf8Data);
        if (msg.utf8Data === 'ok')
          conn.close();
        if (msg.utf8Data === 'not ok')
          conn.close();
      }
    });

    if (conn.connected) {
      conn.sendUTF(encrypted);
    }
  });

  client.connect('ws://localhost:9100', 'echo-protocol');

  return null;
};