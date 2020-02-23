const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const {validateLogin, validateSession, hashPassword} = require('./ms_auth.js');
const {getUsers, registerUser, scheduleRecipe, retrieveUserSchedule} = require('./ms_account.js');

// Bind middleware to app()
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'front-end')));
app.use(cors());

// TEST FUNCTION NOT INTENDED FOR PRODUCTION
app.get('/api/getUsers', getUsers);

// HTTP GET Requests
app.get('/api/getUserSchedule', validateSession, retrieveUserSchedule);


// HTTP POST Requests
app.post('/api/registerUser', hashPassword, registerUser);
app.post('/api/login', validateLogin);
app.post('/api/scheduleRecipe', validateSession, scheduleRecipe);


// Start server on localhost:5000
app.listen(5000, () => console.log('Server started on port 5000'));
