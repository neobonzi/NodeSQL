var net = require('net'),
    JsonSocket = require('json-socket');

var servers = ['127.0.0.1'];
var numberOfServers = servers.length;

var nodes = [];

var initSubscriptions = function(socket) {
   socket.on('connect', function() {
      socket.sendMessage({name: 'James'});
      //handles a message returned from the server
      socket.on('message', function(message) {
         console.log('Server responds: ' + JSON.stringify(message));
      });
      
      //'close' is emitted whenever a server closes
      socket.on('close', function() {
         console.log('Server Disconnected!');
      });
      
   });
};

servers.forEach(function(nodeName) {
   var socket = new JsonSocket(new net.Socket());
   socket.connect(42424, nodeName);
   initSubscriptions(socket);
   nodes.push(socket);
});
