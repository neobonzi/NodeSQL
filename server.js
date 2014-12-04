var config = require('./config'),
    net = require('net'),
    JsonSocket = require('json-socket');

var server = net.createServer();
server.listen(config.port);

console.log('Server is running.');

// Change this when we have a way to calculate this
var numberOfServers = 1;

var collectionServerHash = function(name) {
   // determine which server to send to
   // compute main server and replication server
   var serverRank = 0;
   var repServerRank = 0;
   for (i = 0; i < name.length; i++) {
      serverRank += name.charAt(i);
   }

   serverRank = serverRank % numberOfServers;
   repServerRank = (serverRank + 1) % numberOfServers;

   return {serverRank, repServerRank};
}


server.on('connection', function(socket) {
   socket = new JsonSocket(socket);
   socket.on('message', function(message) {
      console.log('Holy shit, I got a message:' + JSON.stringify(message));
      //socket.sendEndMessage({response: 'Thanks for your message bro'});
      var cmd = message.command;

      if (cmd === "put") {
         servers = collectionServerRank(message.collection);
      } else if (cmd === "find") {

      } else if (cmd === "get") {
         servers = collectionServerRank(message.collection);
      } else if (cmd == "create") {
         servers = collectionServerRank(message.collection);
      }
   });
});



