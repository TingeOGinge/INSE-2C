const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const {validateLogin, validateSession, hashPassword} = require('./ms_auth.js');
const {users, registerUser, scheduleRecipe, retrieveUserSchedule} = require('./ms_account.js');


app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'front-end')));
app.use(cors());

app.get('/api/getUsers', (req, res) => { res.json(users); });
app.get('/api/getUserSchedule', validateSession, retrieveUserSchedule);

app.post('/api/registerUser', hashPassword, registerUser);
app.post('/api/login', validateLogin);
app.post('/api/scheduleRecipe', validateSession, scheduleRecipe);

app.listen(5000, () => console.log('Server started on port 5000'));
