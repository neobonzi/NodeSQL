var fs = require('fs');
var config = require('./config');
var parser = require('./parser');
var readline = require('readline');


/** Constants **/

var readStream = fs.createReadStream(config.inputPath);
var rl = readline.createInterface({ 
   input: readStream,
   output: process.stdout,
   terminal: false
 });

rl.on('line', function (cmd) {
   console.log('Command entered: ' + cmd);
   var query = parser.parse(cmd);
   console.log('Collection Name is: ' + query.collection);
   console.log('Command is: ' + query.command);
   console.log('JSON is: ' + query.json);

   // TODO: Dispatch the command
   
});




 
