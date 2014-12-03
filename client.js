var fs = require('fs');
var parser = require('./parser');
var readline = require('readline');

/** Constants **/
var fileName = '/home/jbilous/MaybeNode/input';

var readStream = fs.createReadStream(fileName);
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




 
