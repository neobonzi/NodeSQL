var config = require('./config'),
    net = require('net'),
    JsonSocket = require('json-socket');

var server = net.createServer();
server.listen(config.port);

console.log('Server is running.');

// Change this when we have a way to calculate this
var numberOfServers = 1;


var documentServerHash = function(id) {
   var server = 0;
   var repServer = 0;
   if (isNaN(Number(id)) {
      for (i = 0; i < name.length; i++) {
         server += name.charAt(i);
      }
   } else {
      server = Number(id);
   }

   server = server % numberOfServers;
   repServer = (server + 1) % numberOfServers;

   return {server, repServer};
}


server.on('connection', function(socket) {
   socket = new JsonSocket(socket);
   socket.on('message', function(message) {
      console.log('Holy shit, I got a message:' + JSON.stringify(message));
      //socket.sendEndMessage({response: 'Thanks for your message bro'});
      var cmd = message.command;

      if (cmd === "put") {
         console.log("put method");
         servers = documentServerHash(message.collection);
      } else if (cmd === "find") {
         console.log("find method");
      } else if (cmd === "get") {
         console.log("get method");
         servers = documentServerHash(message.collection);
      } else if (cmd == "create") {
         console.log("create method");
      }
   });
});



