const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const operation = require('./operation.js');

const transfer_router = express.Router();

transfer_router.post('/new', (req, res) => {
  console.log(req.body);
  let jsondata = JSON.parse(req.body);
  console.log(jsondata.id);
  res.send('Transfer complete!');
});

app.use('/transfer', transfer_router);

server.listen(9100, '0.0.0.0', err => {
  if (err) throw err;
  console.log('Listening on port 9100');
});

io.on('connection', socket => {
  socket.on('new transfer', data => {
    console.log(operation.decrypt(data, '1234'));
  });
});