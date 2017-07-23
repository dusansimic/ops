const express = require('express');
const app = express();
const server = require('http').createServer(app);
const WebSocketServer = require('websocket').server;
const operation = require('./operation.js');
const actions = require('./actions.js');

const transfer_router = express.Router();

app.use('/transfer', transfer_router);

server.listen(9100, '0.0.0.0', err => {
  if (err) throw err;
  console.log('Listening on port 9100');
});

const wsServer = new WebSocketServer({
  httpServer: server,
  autoAcceptConnections: false
});

const originIsAllowed = origin => {
  return true;
};

wsServer.on('request', req => {
  let origin = req.origin;
  if (!originIsAllowed(origin)) {
    req.reject();
    console.log((new Date()) + ' Connection from origin ' + origin + ' rejected!');
    return;
  }

  let conn = req.accept('echo-protocol', origin);
  console.log((new Date()) + ' Connection accepted!');
  conn.on('message', msg => {
    if (msg.type === 'utf8') {
      let decData = JSON.parse(operation.decrypt(msg.utf8Data, '1234'));

      console.log(decData);
      
      if (decData.action === 'transfer')
        actions.transferMoney(decData);
      if (decData.action === 'addaccount')
        actions.addAccount(decData)
      else
        return conn.sendUTF('not ok');
      return conn.sendUTF('ok');
    } else if (msg.type === 'binary') {
      // ignore binary data
      conn.sendBytes({msg: 'ignored'});
    }
  });

  conn.on('close', (reasonCode, description) => {
    console.log((new Date()) + ' Peer ' + conn.remoteAddress + ' disconnected.');
  });
});

