var fs = require('fs'),
    faker = require('../node_modules/faker');
var numCollections = 100;
var numRecords = 5000;
var numOfGets = 0;
var outputFile = '/home/jbilous/NodeSQL/dataGenerator/testData_' + numCollections + '_' + numRecords;

var i, j;
for(i = 0; i < numCollections; i++) {
   var outString = 'NodeSQL.Address' + i + '.create({"key":"streetAddress"});\n';
   fs.appendFileSync(outputFile, outString);
}

for(i = 0; i < numRecords; i++) {
   var collectionNum = Math.floor(Math.random() * numCollections);
   var payload = '{zip : "' + faker.address.zipCode() + '",'
                 + 'city : "' + faker.address.city() + '",'
                 + 'state : "' + faker.address.state() + '",'
                 + 'streetName : "' + faker.address.streetName() + '",'
                 + 'streetAddress : "' + faker.address.streetAddress() + '"}'
   var outString = 'NodeSQL.Address' + collectionNum + '.put(' + payload + ');\n';
   fs.appendFileSync(outputFile, outString);
}


