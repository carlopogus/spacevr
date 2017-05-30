var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(3000);

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.get('/controller/:clientId', function (req, res) {
  res.sendFile(__dirname + '/controller.html');
  // res.send(req.params)
})

app.use(express.static('.'));

io.on('connection', function (socket) {
  // join sockets to rooms.
  socket.on('room', function (room) {
    socket.join(room);
  });
  // on incomming keys from controller, emit to space.
  socket.on('keys', function (data) {
    io.sockets.in(data.id).emit('incomming-keys', data.keys);
  });
});
