var collections = {};

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
   return collections[name] = {key : key, records : {}};
}

exports.collectionExists = function(collectionName) {
   return collectionName in collections; 
}

exports.putDocument = function(collectionName, doc) {
   var collection = collections[collectionName];
   collection.records[doc[collection.key]] = doc;
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
   return collections[collectionName].records[key];
}

/**
 * Find a document givent the collection name and a key value pair
 */
exports.findDocument = function(colName, key, value) {
   var collection = collections[colName];
   var found = {};
   var numFound = 0;
   for (var doc in collections[colName]) {
      if(doc.hasOwnProperty(key) && doc[key] === value) {
         found[numFound++] = doc;
      }
   }
   
}
