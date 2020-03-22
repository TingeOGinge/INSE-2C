const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');
const PRIVATE_KEY = fs.readFileSync(path.join(__dirname, 'private.key'), 'utf-8');
const {query} = require('./ms_database.js');

// Returns either the provided JWT or undefined
function extractToken(req) {
  const bearerHeader = req.headers['authorization'];
  return (bearerHeader != null) ? bearerHeader.split(' ')[1] : undefined;
}

// If a JWT is successfully extracted from the Authorization header it is verified
// Successful verifcation envokes next();
// Invalid tokens return a 404 status and the error message in JSON format
async function validateSession(req, res, next) {
  req.token = extractToken(req);
  if (req.token === undefined) {
    res.sendStatus(404);
  } else {
    jwt.verify(req.token, PRIVATE_KEY, {algorithms: ['RS256']}, (err, payload) => {
      if (err) {
        res.status(401);
        res.json({
          message: 'Access Denied',
          err
        });
      } else {
        req.tokenPayload = payload.data;
        res.body = {token: generateToken(payload.data)};
        next();
      }
    });
  }
}

// Searches for user using name provided in request
// If user exists bcrypt will compare the plain text password and the hashed one
// Successful login returns a JWT to validate future requests
// If user doesn't exist 404 Not Found is returned
// If password is wrong 403 Forbidden is returned
// If the query fails a 500 Internal Server Error is returned
// req.body must include username and password
async function validateLogin (req, res) {
  try {
    if (!(req.body.username && req.body.password)) {
      res.sendStatus(400);
    } else {
      const result = await query('searchAccountName', req.body.username);
      const user = result.rows[0];
      if (user == null) {
        res.sendStatus(404);
      } else if (await bcrypt.compare(req.body.password, user.account_password)) {
        res.status(200);
        const token = generateToken({
          account_username: user.account_username,
          account_id: user.account_id,
          admin_status: user.admin_status
        });
        res.json({token});
      } else {
        res.sendStatus(403);
      }
    }
  } catch (err) {
    console.log(err.stack);
    res.sendStatus(500);
  }

}

// Uses the private RSA key to sign a JWT with a 20 minute expiration
function generateToken(data) {
  return jwt.sign({data}, PRIVATE_KEY, {algorithm: 'RS256', expiresIn: '1d'});
}

// Uses a blowfish cypher encryption method to secure the passwords that will be stored
// Salt is left at the default of ten to provide a middle ground between security and speed
async function hashPassword(req, res, next) {
  if (req.body.password) {
    req.body.password = await bcrypt.hash(req.body.password, 10);
    next();
  } else {
    res.sendStatus(400);
  }
}

module.exports = {extractToken, validateSession, validateLogin, hashPassword};
