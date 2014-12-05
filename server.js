var config = require('./config'),
    net = require('net'),
    JsonSocket = require('json-socket'),
    dataManager = require('./storage'),
    cluster = require('cluster'),
    kue = require('kue');


console.log('Server is running.');

if(cluster.isMaster) {
   var server = net.createServer();
   server.listen(config.port);

   cluster.fork();
   
   var queue = kue.createQueue();

   var numberOfServers = config.nodes.length;

   server.on('connection', function(socket) {
      socket = new JsonSocket(socket);
      socket.on('message', function(message) {
         var cmd = message.command;
         queue.create('query', {message : message}).save();
         console.log('added query to queue');
      });
   });
} else {
   var queue = kue.createQueue();
   var workerSocket = new net.Socket();

   workerSocket.connect(config.port, 'localhost', function() {
      console.log('worker started');
      queue.process('query', 1, function(job, done) {
         var message = job.message;
         if (cmd == "create") {
            console.log("create method");
            dataManager.createCollection(message.collectionName, message.json.key);
         } else if (cmd == "put") {
            console.log("put method");
            
            if(dataManager.collectionExists(message.collection))
            {
	       dataManager.putDocument(message.collection, message.json);
               done();
            } else {
               queue.create('query', {message : message}).attempts(config.numberRetries).save;
               return done(new Error('Can\t put, collection doesn\'t exist yet'));
            }
         } else if (cmd == "find") {
            console.log("find method");
         } else if (cmd == "get") {
            console.log("get method");
            if(dataManager.collectionExists(message.collection))
            {  
               var keyName = datamanager.getKeyForCollection(message.collection);
               var doc = datamanager.getDocument(message.collection, message.json[keyName]);
               workerSocket.write(doc); 
               done(); 
   
            } else {
               return done(new Error('Can\'t get, collection doesn\'t exists yet')); 
            } 
         } else if (cmd == "create") {
            console.log("create method");
         }
      });
   });
}

