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
var documentServerHash = function(message) {
   var server = json.hashCode();
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

   //Dispatch the command
   nodes[documentServerHash(query.json)[0]].sendMessage(query); 
});

