var fs = require('fs');
var config = require('./config');
var parser = require('./parser');
var readline = require('readline');


/** Constants **/
var net = require('net'),
    JsonSocket = require('json-socket');

var socket = new JsonSocket(new net.Socket());
socket.connect(config.port, config.nodes[0]);

var readStream = fs.createReadStream(config.inputPath);
var rl = readline.createInterface({ 
   input: readStream,
   output: process.stdout,
   terminal: false
 });

rl.on('line', function (cmd) {
   console.log('Command entered: ' + cmd);
   var query = parser.parse(cmd);

   //Dispatch the command
   socket.sendMessage(query);
});

socket.on('message', function(message) {
   console.log('Got a message from server: ' + message.response);
});

socket.on('close', function(something) {
   console.log('Goodbye!');
}); 
