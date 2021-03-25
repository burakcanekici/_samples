const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const fileupload = require("express-fileupload");
var multer = require('multer');
var upload = multer();
const fs = require("fs");

const { validationRule1, validationRule2, validate } = require('./validations.js');

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(express.static('files'));
// make comment if we use multer instead of fileupload
app.use(fileupload());

app.post('/fileupload', validationRule1(), validate, async function (req, res) {
	var file = req.files.file;
	var buffer = file.data;
	const content = buffer.toString('utf8');

	const filePath = __dirname + '/fileupload.mxml';
	await fs.unlinkSync(filePath);
		await fs.writeFile(filePath, content, { flag: 'a+' }, function (err) {
			if (err) res.status(500).json({'errors': [{'msg':err}]});
		});
	
  	res.send('welcome, ' + req.body.name + ' ' + req.body.surName);
})

app.post('/multer', upload.single('file'), async function (req, res) {
	var file = req.file;
	var buffer = file.buffer;
	const content = buffer.toString('utf8');

	const filePath = __dirname + '/multer.mxml';
	await fs.unlinkSync(filePath);
		await fs.writeFile(filePath, content, { flag: 'a+' }, function (err) {
			if (err) res.status(500).json({'errors': [{'msg':err}]});
		});
	
  	res.send('welcome, ' + req.body.name + ' ' + req.body.surName);
})

app.listen(5000, () => console.log("Yayýn baþladý."));