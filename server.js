var config = require('./config'),
    net = require('net'),
    JsonSocket = require('json-socket');

var server = net.createServer();
server.listen(config.port);

console.log('Server is running.');

var collectionServerHash = function(name) {
   // determine which server to send to 
}

var getServerHash = function(id, collection) {
   // determine which server to do the get on
}

server.on('connection', function(socket) {
   socket = new JsonSocket(socket);
   socket.on('message', function(message) {
      console.log('Holy shit, I got a message:' + JSON.stringify(message));
      //socket.sendEndMessage({response: 'Thanks for your message bro'});
      var cmd = message.command;

      if (cmd === "put") {

      } else if (cmd === "find") {

      } else if (cmd === "get") {

      } else if (cmd == "create") {

      }
   });
});



