/** @module ms_entry
*/
/**ms_entry contains the server code wherein we define the HTTP routes.
* * We also bind middlewares to app such as
*   * express.json() to interpret request bodies as JSON
*   * CORS to allow for cross origin resource sharing
* Here we define the static folder to serve the front end HTML pages etc
* * HTTP GET requests
*   * mainSearch allows users to pass parameters and search for recipes
*   * getUserSchedule allows a validated session to pull back their schedule from the server
* * HTTP post requests
*   * registerUser registers a user on the server
*   * login logs a user into the server
*   * scheduleRecipe allows a user to schedule a specific recipe at a specific time
*   * deleteFromSchedule allows a user to delete a specific, scheduled recipes from their profile
*/

const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const {validateLogin, validateSession, hashPassword} = require('./ms_auth.js');
const {search, getRecipe} = require('./ms_algorithm.js');

const {
  registerUser,
  scheduleRecipe,
  retrieveUserSchedule,
  deleteFromSchedule } = require('./ms_account.js');

// Bind middleware to app()
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'front-end')));
app.use(cors());

// HTTP GET Requests
app.get('/api/getUserSchedule', validateSession, retrieveUserSchedule);
app.get('/api/mainSearch', search);
app.get('/api/getRecipe/:id', getRecipe);


// HTTP POST Requests
app.post('/api/registerUser', hashPassword, registerUser);
app.post('/api/login', validateLogin);
app.post('/api/scheduleRecipe', validateSession, scheduleRecipe);
app.post('/api/deleteFromSchedule', validateSession, deleteFromSchedule);


module.exports = app;
