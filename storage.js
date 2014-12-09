var winston = require('winston'),
    path    = require('path'),
    sizeof  = require('sizeof');

var collections = {};

var logger = new (winston.Logger)({
    transports: [
      new (winston.transports.File)({ filename: path.resolve(__dirname, 'server_output.log'), timestamp : true })
    ]
  });

var elapsedTime = function(startDate, endDate) {
      return (((new Date() - startDate)/ 1000) % 60) + 's';
}


exports.getCollections = function() {
   return collections;
}

exports.getCollection = function(name) {
   return collections[name];
}

exports.createCollection = function(name, key) {
   if (collections[name]) {
      return collections[name];
   }

   logger.info('CREATE [ collection_name : ' + name + ' ] ');
   return collections[name] = {key : key, records : {}};
}

exports.collectionExists = function(collectionName) {
   return collectionName in collections; 
}

exports.putDocument = function(collectionName, doc) {
   var collection = collections[collectionName];
   collection.records[doc[collection.key]] = doc;
   
   logger.info('PUT [ key : ' + doc[collection.key] + ', collection_size: ' + sizeof.sizeof(collection.records) + ' ] ');
}

exports.getKeyForCollection = function(collectionName) {
   if(!'collectionName' in collections)
   {
      return undefined;
   }
   return collections[collectionName]['key'];
}

/**
 * See if a doc with the given key exists in a collection
 */ 
exports.getDocument = function(collectionName, key) {
   
   logger.info('GET [ key : ' + key + ' ]');
   return collections[collectionName].records[key];
}

/**
 * Find a document givent the collection name and a key value pair
 */
exports.findDocument = function(colName, key, value) {
   var collection = collections[colName];
   var found = [];
   var numFound = 0;
   var startTime = Date();
   for(colKey in collections[colName].records) {
      var doc = collections[colName].records[colKey];
      if(doc.hasOwnProperty(key) && doc[key] === value) {
         found[numFound++] = doc;
      }
   }

   logger.info('FIND [ key : ' + key + ', collection_size: ' + sizeof.sizeof(collection) + ', time_taken: ' + elapsedTime(startTime, new Date()) + '] ');
   
   return found; 
}
