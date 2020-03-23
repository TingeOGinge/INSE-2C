/** @module ms_entry
*/
/**ms_entry is the server code for which the rest of the backend runs off.
* * Bind middleware to app
* * HTTP get requests
* * HTTP post requests
*/

const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const {validateLogin, validateSession, hashPassword} = require('./ms_auth.js');
const {search} = require('./ms_algorithm.js');

const {
  getUsers,
  registerUser,
  scheduleRecipe,
  retrieveUserSchedule,
  deleteFromSchedule } = require('./ms_account.js');

// Bind middleware to app()
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'front-end')));
app.use(cors());

// TEST FUNCTION NOT INTENDED FOR PRODUCTION
app.get('/api/getUsers', validateSession, getUsers);

// HTTP GET Requests
app.get('/api/getUserSchedule', validateSession, retrieveUserSchedule);
app.get('/api/mainSearch', search);


// HTTP POST Requests
app.post('/api/registerUser', hashPassword, registerUser);
app.post('/api/login', validateLogin);
app.post('/api/scheduleRecipe', validateSession, scheduleRecipe);
app.post('/api/deleteFromSchedule', validateSession, deleteFromSchedule);


module.exports = app;
