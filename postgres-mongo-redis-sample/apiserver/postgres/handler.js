const {Pool} = require('pg');

async function getByParameters(args){
	const pool = new Pool({
  		user: 'postgres',
  		host: 'localhost',
    		database: 'postgres',
    		password: 'postgres',
    		port: 5432,
	});

	let query = 'SELECT * FROM REQS'
	if(args.length > 0) query += ' WHERE req_id = $1';

	const rows = new Promise((resolve, reject) => {
		pool.query(query, args, (err, result) => {
			if(err) { reject(err);}
			resolve(result);
		});
	});
	return rows;
}

module.exports = {
	getByParameters
}