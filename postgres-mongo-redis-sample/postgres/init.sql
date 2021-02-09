CREATE TABLE REQS (
	req_id serial PRIMARY KEY NOT NULL,
	request VARCHAR(50) NOT NULL,
	response VARCHAR(50) NOT NULL
);

INSERT INTO REQS (request, response) VALUES ('req1', 'res1');
INSERT INTO REQS (request, response) VALUES ('req2', 'res2');
INSERT INTO REQS (request, response) VALUES ('req3', 'res3');