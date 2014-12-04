
exports.parse = function (cmd) {
   var splitOnDot = cmd.split(".");
   var collection = splitOnDot[1];
   var command = splitOnDot[2].split("(")[0];
   var json = splitOnDot[2].split("(")[1].split(")")[0];

   if (command != "put" && command != "create" && command != "find" &&
         command != "get") {
      console.log("Syntax error");
   }
   return { json : json, command : command, collection : collection };
}
