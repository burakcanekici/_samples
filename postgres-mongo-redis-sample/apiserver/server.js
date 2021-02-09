const express = require('express')
const app = express()
const port = 8080
const querystring = require('querystring')

const PostgresHandler = require('./postgres/handler.js');
const RedisHandler = require('./redis/handler.js');
const MongoHandler = require('./mongo/handler.js');

app.get('/postgres/requests/:id?', async (req, res, next) => {
	const param = req.params.id == undefined ? [] : [req.params.id];

	await PostgresHandler.getByParameters(param)
	.then((result) => {res.send(result.rows);})
	.catch((err) => {res.send(err);});
})

app.get('/mongo/requests/:id?', async (req, res, next) => {
	const param = req.params.id == undefined ? {} : {request : req.params.id};

	await MongoHandler.getByParameters(param)
	.then((result) => {res.send(result);})
	.catch((err) => {res.send(err);});
})

app.get('/redis/requests/:id', async (req, res, next) => {
	const param = req.params.id;

	await RedisHandler.getByParameters(param)
	.then((result) => {res.send(result);})
	.catch((err) => {res.send(err);});
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})