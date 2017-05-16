var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(3000);

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.get('/controler/:clientId', function (req, res) {
  res.sendFile(__dirname + '/controller.html');
  // res.send(req.params)
})

app.use(express.static('.'));


var space = io
  .of('/space')
  .on('connection', function (socket) {
    console.log('someone connected from space');
    socket.emit('clientId', socket.id);
  });

var controller = io
  .of('/controller')
  .on('connection', function (socket) {
    console.log('someone connected from ground control');
    socket.emit('clientId', socket.id);
  });



io.on('connection', function (socket) {
  console.log(socket.id);
  // console.log('client connected ' + socket.id);
  socket.emit('clientId', socket.id);
  // socket.on('my other event', function (data) {
  //   console.log(data);
  // });
});
