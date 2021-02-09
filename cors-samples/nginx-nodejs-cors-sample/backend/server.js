var express = require('express');
var app = express();
var fs = require("fs");

var squirtle = {
   "pokemon7" : {
      "name" : "Squirtle",
      "id" : "007",
      "profession" : ["water"]
   }
}

app.get('/services/pokemon', function (req, res) {
   fs.readFile( __dirname + "/" + "pokemon.json", 'utf8', function (err, data) {
      console.log( data );
      res.end( data );
   });
})

app.post('/services/pokemon', function (req, res) {
   fs.readFile( __dirname + "/" + "pokemon.json", 'utf8', function (err, data) {
      data = JSON.parse( data );
      data["pokemon7"] = squirtle["pokemon7"];
      res.end( JSON.stringify(data));
   });
})

var server = app.listen(8080, function () {
   var host = server.address().address
   var port = server.address().port
   console.log("Pokemon app listening at http://%s:%s", host, port)
})