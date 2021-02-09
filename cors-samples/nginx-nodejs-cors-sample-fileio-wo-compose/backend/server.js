var express = require('express');
var bodyParser = require('body-parser');
const url = require('url');
const querystring = require('querystring');
const fileupload = require("express-fileupload");

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(fileupload());

var fs = require("fs");

const PORT = 8080;
const HOST = '0.0.0.0';

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
      res.send( data );
   });
})

app.post('/services/pokemon', function (req, res) {
   fs.readFile( __dirname + "/" + "pokemon.json", 'utf8', function (err, data) {
      data = JSON.parse( data );
      data["pokemon7"] = squirtle["pokemon7"];
      res.end( JSON.stringify(data));
   });
})

app.get('/services/download', function (req, res) {
   res.download(__dirname + "/" + "output.bpmn", function (err) {
		if(err){
			console.log(err);
		}
	});
})

app.post('/services/upload', function (req, res) {
	var file = req.files.file;
	var buffer = file.data;
	const content = buffer.toString('utf8');
	
	fs.truncate('output.bpmn', 0, function(){})
	fs.writeFile('output.bpmn', content, { flag: 'a+' }, function (err) {
		if (err) return console.log(err);
	});
	res.status(200).json({msg: 'Transaction has been submitted from -> ' + req.body.title});
})

/*
app.get('/services/downloadA', function (req, res) {
	var files = fs.createReadStream("test.bpmn");
	res.writeHead(200, {'Content-disposition': 'attachment; filename=test.bpmn'});
	files.pipe(res)
})
*/

app.listen(PORT, HOST);
console.log("Pokemon app listening at http://%s:%s", HOST, PORT)