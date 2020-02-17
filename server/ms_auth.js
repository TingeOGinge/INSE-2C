const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');
const PRIVATE_KEY = fs.readFileSync(path.join(__dirname, 'private.key'), 'utf-8');
const {users} = require('./ms_account.js');

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

async function hashPassword(req, res, next) {
  req.body.password = await bcrypt.hash(req.body.password, 10);
  next();
}

module.exports = {extractToken, validateSession, validateLogin, hashPassword};
