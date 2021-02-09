const redis = require("redis");

async function getByParameters(args){
	const redisPort = 6379;
	const client = redis.createClient(redisPort);

	client.on('error', err => { new Error(err); });

	const row = new Promise((resolve, reject) => {
		client.get(args, function(err, result) {
			if(err) reject(err);
			resolve(result);
		});
	});
	return row;
}

module.exports = {
	getByParameters
}