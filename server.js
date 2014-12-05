var config = require('./config'),
    net = require('net'),
    JsonSocket = require('json-socket'),
    dataManager = require('./storage');

var server = net.createServer();
server.listen(config.port);

console.log('Server is running.');

var numberOfServers = config.nodes.length;

server.on('connection', function(socket) {
   socket = new JsonSocket(socket);
   socket.on('message', function(message) {
      var cmd = message.command;

      if (cmd == "create") {
         console.log("create method");
         dataManager.createCollection(message.collectionName, message.json.key);
      } else if (cmd == "put") {
         console.log("put method");
         dataManager.putDocument(message.collection, message.json); 
      } else if (cmd == "find") {
         console.log("find method");
      } else if (cmd == "get") {
         console.log("get method");
         var keyName = datamanager.getKeyForCollection(message.collection);
         var doc = datamanager.getDocument(message.collection, message.json[keyName];
          
      } else if (cmd == "create") {
         console.log("create method");
      }
   });
});



