var fs = require('fs');
var config = require('./config');
var parser = require('./parser');
var readline = require('readline');


/** Constants **/
var net = require('net'),
    JsonSocket = require('json-socket');

// Stores an array of server connections
var nodes = [];

//Number of curently active servers
var numberOfServers = config.nodes.length;

// Collection keys
var collectionKeys = {};

// Utility function to initialize a sockets events
var initSubscriptions = function(socket) {
   socket.on('connect', function() {
      socket = new JsonSocket(socket);
   
      socket.on('message', function(message) {
         console.log('Got a message from server: ' + JSON.stringify(message));
      });

      socket.on('close', function(something) {
         console.log('Goodbye!');
      }); 
   });
};

// Add a hashCode function to String for use in overall hashing
// Lifted from http://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript-jquery
String.prototype.hashCode = function() {
   var hash = 0, i, chr, len;
   if (this.length == 0) return hash;
   for(i = 0, len < this.length; i < len; i++) {
      chr = this.charCodeAt(i);
      hash = ((hash << 5) - hash) + chr;
      hash |= 0;
   }
   return hash;
}

// Utility function to hash a command
var documentServerHash = function(query) {
   console.log('hashing ' + JSON.stringify(query));
   var jsonObject = eval('(' + query.json + ')');
   var collectionName = query.collection;
   console.log('collection name ' + collectionName);
   var collectionKey  = collectionKeys[collectionName];
   console.log('collection key ' + collectionKey);
   console.log('json object ' + JSON.stringify(jsonObject))
   var collectionKeyValue = jsonObject[collectionKey];
   console.log('collection key value ' + collectionKeyValue);
   var server = (collectionName.hashCode() + collectionKey.hashCode() + collectionKeyValue.hashCode()) % numberOfServers;
   return [server, (server + 1) % numberOfServers];
}


// Create a connection for every node in our config
config.nodes.forEach(function(nodeName) {
   var socket = new JsonSocket(new net.Socket());
   socket.connect(config.port, nodeName);
   nodes.push(socket);
   initSubscriptions(socket);
});


// Begin command I/O
var readStream = fs.createReadStream(config.inputPath);
var rl = readline.createInterface({ 
   input: readStream,
   output: process.stdout,
   terminal: false
 });

rl.on('line', function (cmd) {
   var query = parser.parse(cmd);
   
   // Save the collection keys for hashing purposes
   // Distribute a collection creation to all nodes
   if(query.command == 'create') {
      var jsonObject = eval('(' + query.json + ')'); 
      collectionKeys[query.collection] = jsonObject['key'];
      console.log('collectionKeys is now ' + JSON.stringify(collectionKeys));
      nodes.forEach(function(node) {
         console.log('sending a create query');
         node.sendMessage(query);
      });
   } else {
      //Dispatch the command
      nodes[documentServerHash(query)[0]].sendMessage(query);
   }
});

