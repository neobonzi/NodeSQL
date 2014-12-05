var collections = {};

exports.getCollection = function(name) {
   return collections[name];
}

exports.createCollection = function(name, key) {
   if (collections[name]) {
      return collections[name];
   }
   return collections[name] = {'key' : key, 'records' : {}};
}

exports.putDocument = function(collectionName, doc) {
   var collection = collections[collectionName];
   collection[collection.keyName] = doc;
}

exports.getKeyForCollection = function(collectionName) {
   return collections[collectionName]['key'];
}

/**
 * See if a doc with the given key exists in a collection
 */ 
exports.getDocument = function(collectionName, key) {
   return collections[collectionName][key];
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
