# pl-nodejs-assignment

### Application description
This test assignment will have you build an application with the following REST endpoints:

- /signup 
  - Sign up to the system (username, password)
- /login
  - Logs in an existing user with a password
- /me
  - Get the currently logged in user information
- /me/update-password
  - Update the current users password
- /user/:id/
  - List username & number of likes of a user
- /user/:id/like
  - Like a user
- /user/:id/unlike
  - Un-Like a user
- /most-liked
  - List users in a most liked to least liked
  
Each user can like another only once, and they can unlike eachother.
The bolded endpoints are authenticated calls.
Select the appropriate REST calls (get, put,post, delete) by yourself.

### Required functionality
- jwt token authentication
- Json server responses
- Tests
  - All your endpoints must have at least one test, multiple edge case tests are a bonus
  
### Use
- Node.js v8 (async/await functionality preferred)
- postgresql/mysql/mongodb (your choice)
- A backend framework - your choice
  - Express.js
  - Koa.js
  - Git & gitflow (It is not necessary to push the code to github, gitlab or a similar service but it will make it easier for us to review your assignment.)

### Prerequisites

What things you need to install before running app

```
PostgreSQL
```
```
Node.js
```

### Installing

A step by step series of examples that tell you how to get a development env running

Say what the step will be

```
npm install
```

Configure local and test environment in `configuration` folder

```
DB_USER=
DB_PASS=
DB_NAME=
DB_HOST_DOMAIN=
DB_HOST_PORT=
JWT_SECRET=
```

For first time you need to create database and tables
```
npm run db:clean
```

To run application
```
npm run start
```

## Running the tests

Explain how to run the automated tests for this system
```
npm run test
```

## Testing from postman

```
There is a postman folder which contain environment.json and collection.json files so it is easy to import them in postman app and test APIs easly.
```
