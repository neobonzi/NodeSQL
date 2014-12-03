var config = require('./config'),
    net = require('net'),
    JsonSocket = require('json-socket');

var server = net.createServer();
server.listen(config.port);

console.log('Server is running.');

server.on('connection', function(socket) {
   socket = new JsonSocket(socket);
   socket.on('message', function(message) {
      console.log('Holy shit, I got a message:' + JSON.stringify(message));
      //socket.sendEndMessage({response: 'Thanks for your message bro'});
   });
});

