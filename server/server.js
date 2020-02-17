const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const PRIVATE_KEY = fs.readFileSync(path.join(__dirname, 'private.key'), 'utf-8');

app.use(express.json());
app.use(express.static(__dirname + '/'));
app.use(cors());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/home.html'));
})

// Storing users in local memory for testing purposes
// Will eventually communicate with the database
const users = [];

app.get('/api/getUsers', (req, res) => { res.json(users) });

app.post('/api/registerUser', registerUser);

async function registerUser(req, res) {
  const user = users.find(user => user.username === req.body.username);
  if (user) {
    return res.sendStatus(409);
  } else {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const user = {
        username: req.body.username,
        password: hashedPassword,
        scheduledRecipes: []
      };
      users.push(user);
      res.sendStatus(201);
    }
}

app.post('/api/login', validateLogin);

async function validateLogin (req, res) {
  const user = users.find(user => user.username === req.body.username);
  if (user == null) {
    res.sendStatus(404);
  } else if (await bcrypt.compare(req.body.password, user.password)) {
    res.status(200);
    const token = generateToken({
      username: user.username,
      pseudoID: users.indexOf(user)
    });
    res.json({token});
  } else {
    res.sendStatus(403);
  }
}

function generateToken(data) {
  return jwt.sign({data}, PRIVATE_KEY, {algorithm: 'RS256', expiresIn: '20m'});
}

app.get('/api/protectedRoute', extractToken, validateSession, showProtectedResources);

function showProtectedResources(req, res) {
  res.json({
    message: "Protected resources successfully accessed"
  });
}

function extractToken(req, res, next) {
  const bearerHeader = req.headers['authorization'];
  if (bearerHeader) {
    req.token = bearerHeader.split(' ')[1];
    next();
  } else {
    res.sendStatus(404);
  }
}

async function validateSession(req, res, next) {
  jwt.verify(req.token, PRIVATE_KEY, {algorithms: ['RS256']}, (err, payload) => {
    if (err) {
      res.status(401);
      res.json({
        message: 'Access Denied',
        err
      });
    } else {
      req.body.tokenData = payload.data;
      next();
    }
  });
}

app.post('/api/scheduleRecipe', extractToken, validateSession, scheduleRecipe);

function scheduleRecipe(req, res) {
  const user = users.find(user => user.username === req.body.tokenData.username);
  user.scheduledRecipes.push({
    recipeID: req.body.recipeID,
    scheduledTime: req.body.scheduledTime
  })
  console.log(user);
  res.sendStatus(200)
}

app.listen(5000, () => console.log('Server started on port 5000'));
