# Assignment
## Installation
Download and extract the repository to anywhere you want. The directory should be mentioned below.
* The `apiserver` contains all necessary files to API server I developed and the dockerize configuration of it.
* The `postgres` contains initial SQL to create table for keeping requests and the dockerize configuration of it.
* The `docker-compose.yaml` contains description of where the configuration of containers is and how to run these containers together. 
```javascript
-> trendyol
  | -> apiserver
  | -> postgres
  | -> docker-compose.yaml
```
In `apiserver` directory, we open command prompt and run the following command.
```
docker-compose up
```
This command will create and run two containers as the image below.
<kbd>![alt text](https://github.com/burakcanekici/_vue-samples/blob/main/base/image/containers.png)</kbd>
 ## Endpoints
The API server is available at `https://localhost:146` when the containers are run and it has two endpoints which are listed below.
| Endpoint | HTTP Method | Request | Response | Description |
| :--- | :---: | :--- | :---: | :--- |
| `api/urltodeep` | `POST`  | `{ url : '' }` | `{ deep : '' }` | responsible for converting url to deeplink | 
| `api/deeptourl` | `POST`  | `{ deep : '' }` | `{ url : '' }` | responsible for converting deeplink to url | 
## Project Structure
### Postgres Container
This container is only responsible from hosting the Portgres database. With the `init.sql` method that placed in `postgres` directory, a table called `requests` is created to keep all requests that the API server is received. The columns of this table seem below.
| Column Name | Type | Nullable? |
| :--- | :--- | :--- |
| `id` | `PRIMARY KEY`  | Not |
| `request` | `VARCHAR`  | Not |
| `response` | `VARCHAR`  | Not |
| `created_on` | `TIMESTAMP`  | Not |
### API Container
This container is responsible from hosting the API server. This API server coding for the process in the workflow below.
<kbd>![alt text](https://github.com/burakcanekici/_vue-samples/blob/main/base/image/wf.png)</kbd>

During this process;
1. The request object that contains `url` or `deep` parameter is received by the endpoint that it is sent to.
2. After receiving the request object, the relevant `validationRules` method is triggered before controller action. There are two different validation rules in `_validation/validation.js` class, one for conversion from url to deeplink, and the other one for conversion between deeplink to url.
   - If format is incorrect, a response is return with `422` status code.
   - If format is correct, the relevant controller method is called.
3. There are three different request format each endpoint and, according to the request format, we will determine which response should be produced and returned. Hence, the design pattern called `Factory Pattern` was used as the creation moment of the `Page` object. The UML diagram below shows the structure. There are three extended `Page` type, which are `PageProductDetail`, `PageSearch`, and `PageOther`. According to the request format, we will determine which `Page` object should be produced through `getPage` method in the `_utils/pagefactory.js` class.

<kbd>![alt text](https://github.com/burakcanekici/_vue-samples/blob/main/base/image/factory.png)</kbd>

4. After creating the `Page` object properly, up to the endpoint used, the `convertToDeeplink` or `convertToUrl` method is called and the response object is produced.
5. If the response object is produced successfuly, the request and response will be recorded to Postgres database. There are two different class in `_dbhandler` directory;
   - The `_dbhandler/pool.js` class containes the configuration of the `Pool` object which is uses to execute database queries between Nodejs and Postgres. During the creation of the `Pool` object, the design pattern called `Singleton Pattern` was used for creating only one instance from it and using only this instance from any class. The following UML diagram shows how to the `Pool` object was created.
   
   <kbd>![alt text](https://github.com/burakcanekici/_vue-samples/blob/main/base/image/pool.png)</kbd>
   
   - The `_dbhandler/repository.js` class is where I defined the database operation, in this case just `insert` method, and it provides to execute queries through the instance of the `Pool` object that it gets.
6. After calling the `insert` method,
   - If any error occurs, a response is return with `500` status code.
   - If any error does not occur, a response is return with `200` status code.
## Error Handling
In this section, how to handle with errors was explained. As it seems in the workflow diagram, there are different error types that return to user. Therefore, the error types that the API server return regards to circumstances were customized and used. These custom errors extend from the following `BaseError` class. This class compounds of, 
* The `error`, `httpCode`, and `description` parameters were sepecified for the error types we defined.
* The `getErrorMessage` defined at base class level because this method is common for each error type and it returns what we show in the response body.
```javascript
class BaseError extends Error {
	constructor(error, httpCode, description) {
		super(description);
		this.error = error;
		this.httpCode = httpCode;
		this.description = description;
	} 
	
	getErrorMessage(){
		return { err: this.error, msg: this.description };
	}
}
```

Also, the Http status codes were defined in the `HttpStatusCode` object.

```javascript
const HttpStatusCode = Object.freeze({
	OK : 200,
	BAD_REQUEST : 400,
	BAD_INPUT_FORMAT : 422,
	NOT_FOUND : 404,
	INTERNAL_SERVER : 500
});
```
In this project, the `InputParameterError` and `DatabaseError` were created. but any new error type easily added by extending the `BaseError` class.
Therefore, we can thrown an exception by using its constructor.
> When a new error type is supposed to be defined, it can be declared like the errors below, and then it can be throwed directly where we want. There is no need to more specification.

```javascript
/* It is defined for the errors that cause from the input parameters(422 - Unprocessable Entity). */
class InputParameterError extends BaseError {
	constructor(message) {
		super("Invalid input parameter(s)", HttpStatusCode.BAD_INPUT_FORMAT, message);
	}
}

/* It is defined for the errors that cause from the database(500 - Internal Server Error). */
class DatabaseError extends BaseError {
	constructor(message) {
		super("Database error", HttpStatusCode.INTERNAL_SERVER, message);
	}
}

/* It is defined for the errors that cause from the insufficient object(500 - Internal Server Error). */
class InsufficientObjectError extends BaseError {
    constructor(message) {
        super("Object error", HttpStatusCode.INTERNAL_SERVER, message);
    }
}
```

After creating base error class and defining custom error types, handling these errors are essential. Hence, the following `handleError` method was defined in `error-handler.js` class declare the response object.

```javascript
const handleError = (err, res) => {
  res.status(err.httpCode).send(err.getErrorMessage());
};
```
Finally, this `handleError` method was called in `server.js` through the error-handling middleware that is a special type of middleware. Different from a regular middleware, it accepts four arguments. It provides that returning the custom error that we defined when it is thrown.

```javascript
//expressjs middleware
app.use((err, req, res, next) => {
  Error.handleError(err, res);
});
```

Hence, the custom errors can be thrown by the following ways with any additional message we want.

```javascript
reject(new InputParameterError("input parameter error message!"));

-- or --

throw new ErrorHandler(new InputParameterError("input parameter error message!"));
```

## Test
For testing the application, the `jest` framework was used. Aside from the `jest`,
* the `sinon` framework was used for stubbing
* the `supertest` framework was used for testing the APIs

The `jest` was run in `coverage` mode and the following results was get;

<kbd>![alt text](https://github.com/burakcanekici/_vue-samples/blob/main/base/image/coverage.PNG)</kbd>
