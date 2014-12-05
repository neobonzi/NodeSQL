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
         if(message.command == 'get' || message.command == 'put') {
            queue.create('query', message).attempts(5).save();
         } else {
            queue.create('query', message).save();
            console.log('added query to queue');
         }
      });
   });
} else {
   var queue = kue.createQueue();
   var workerSocket = new net.Socket();
   var workerSocket = new JsonSocket(workerSocket); 
   workerSocket.connect(config.port, 'localhost', function() {
      console.log('worker started');
      queue.process('query', 1, function(job, done) {
         console.log('worker pulling somethign off of queue');
         var message = job.data;
         var cmd = message.command;
         if (cmd == "create") {
            console.log("create method");
            dataManager.createCollection(message.collection, eval("(" + message.json + ")").key);
            console.log('created collection');
            done();
         } else if (cmd == "put") {
            console.log("put method");
            console.log(dataManager.getCollections()); 
            if(dataManager.collectionExists(message.collection))
            {
	       dataManager.putDocument(message.collection, eval("(" + message.json + ")"));
               console.log("put done, collections is now" + JSON.stringify(dataManager.getCollections()));
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
               var jsonObject = eval("(" + message.json + ")");
               var keyName = dataManager.getKeyForCollection(message.collection);
               var doc = dataManager.getDocument(message.collection, jsonObject.key);
               console.log("found doc: " + JSON.stringify(doc));
               workerSocket.sendMessage(doc); 
               done(); 
   
            } else {
               console.log('shit');
               return done(new Error('Can\'t get, collection doesn\'t exists yet')); 
            } 
         } else if (cmd == "create") {
            console.log("create method");
         }
      });
   });
}

