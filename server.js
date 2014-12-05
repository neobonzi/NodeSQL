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
         console.log(JSON.stringify(message));
         if(message.command == 'get' || message.command == 'put') {
            var job = queue.create('query', message);

            if(message.command == 'get') {
               job.on('complete', function(result) {
                  socket.sendMessage(result);
               });
            }

            job.attempts(5).save();
         } else {
            queue.create('query', message).save();
         }
      });
   });

} else {
   var queue = kue.createQueue();
   var workerSocket = new net.Socket();
   var workerSocket = new JsonSocket(workerSocket); 
      queue.process('query', 1, function(job, done) {
         var message = job.data;
         var cmd = message.command;
         if (cmd == "create") {
            // Pass the collection name and the JSON Payload as an object to the data manager
            // Note that json must be placed in parentheses to be eval'd correctly
            console.log("evaling " + message.json);
            dataManager.createCollection(message.collection, eval("(" + message.json + ")").key);
            done();
         } else if (cmd == "put") {
            console.log(dataManager.getCollections()); 
            if(dataManager.collectionExists(message.collection))
            {
	       dataManager.putDocument(message.collection, eval("(" + message.json + ")"));
               done();
            } else {
               queue.create('query', {message : message}).attempts(config.numberRetries).save;
               return done(new Error('Can\t put, collection doesn\'t exist yet'));
            }
         } else if (cmd == "find") {
            console.log("find method");
         } else if (cmd == "get") {
            if(dataManager.collectionExists(message.collection))
            {  
               var jsonObject = eval("(" + message.json + ")");
               var keyName = dataManager.getKeyForCollection(message.collection);
               var doc = dataManager.getDocument(message.collection, jsonObject[keyName]);
               done(null, doc); 
   
            } else {
               console.log('shit');
               return done(new Error('Can\'t get, collection doesn\'t exists yet')); 
            } 
         }
      });
}

