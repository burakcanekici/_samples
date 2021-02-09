const mongoose = require("mongoose");
const Schema = mongoose.Schema;

async function getByParameters(args){
	var uri = "mongodb://localhost:27017/reqs_db";
	mongoose.connect(uri, { 
		"auth": { "authSource": "admin" },
		"user": "be",
		"pass": "be",
		useNewUrlParser: true,
		useUnifiedTopology: true });

	const connection = mongoose.connection.on('error', err => { new Error(err); });

	let reqs = new Schema(
		{
			request: { type: String },
			response: { type: String }
		}, {collection: "reqs"});

	var reqsIns;
	try { reqsIns = mongoose.model("reqs", reqs); }
	catch(err) { reqsIns = mongoose.model("reqs"); }

	const rows = new Promise((resolve, reject) => {
		reqsIns.find(args, function(err, result) {
			mongoose.connection.close();
			if(err) reject(err);
			resolve(result);
		});
	});
	return rows;
}

module.exports = {
	getByParameters
}