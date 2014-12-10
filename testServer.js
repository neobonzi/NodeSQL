var net = require('net'),
    JsonSocket = require('json-socket');

var server = net.createServer();
server.listen(42424);

server.on('connection', function(socket) {
   console.log('connected');
   socket = new JsonSocket(socket);
   socket.on('message', function(message) {
      socket.sendMessage('Hello ' + message.name);
   });
});
