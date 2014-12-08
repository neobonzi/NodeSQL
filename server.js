var config = require('./config'),
    net = require('net'),
    JsonSocket = require('json-socket'),
    dataManager = require('./storage'),
    cluster = require('cluster'),
    kue = require('kue');



if(cluster.isMaster) {
   console.log('Welcome to NodeSQL');
   var server = net.createServer();
   server.listen(config.port);

   cluster.fork();
   
   var queue = kue.createQueue();

   var numberOfServers = config.nodes.length;

   server.on('connection', function(socket) {
      socket = new JsonSocket(socket);
      socket.on('message', function(message) {
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
            console.log("creating collection");
            // Pass the collection name and the JSON Payload as an object to the data manager
            // Note that json must be placed in parentheses to be eval'd correctly
            dataManager.createCollection(message.collection, eval("(" + message.json + ")").key);
            done();
         } else if (cmd == "put") {
            if(dataManager.collectionExists(message.collection))
            {
               console.log("putting a document into" + message.collection);
	       dataManager.putDocument(message.collection, eval("(" + message.json + ")"));
               done();
            } else {
               queue.create('query', {message : message}).attempts(config.numberRetries).save;
               return done(new Error('Can\t put, collection doesn\'t exist yet'));
            }
         } else if (cmd == "find") {
            var jsonObject = eval("(" + message.json + ")");
            var foundObjects = []
            for(key in jsonObject) {
               if(jsonObject.hasOwnProperty(key)) {
                  var foundObjects = dataManager.findDocument(message.collection, key, jsonObject[key]);
               }
            }
             
            done(null, foundObjects);
         } else if (cmd == "get") {
            if(dataManager.collectionExists(message.collection))
            {  
               var jsonObject = eval("(" + message.json + ")");
               var keyName = dataManager.getKeyForCollection(message.collection);
               var doc = dataManager.getDocument(message.collection, jsonObject[keyName]);
               done(null, doc); 
   
            } else {
               return done(new Error('Can\'t get, collection doesn\'t exists yet')); 
            } 
         }
      });
}

