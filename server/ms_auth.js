/** @module ms_auth
*/
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');
const PRIVATE_KEY = fs.readFileSync(path.join(__dirname, 'private.key'), 'utf-8');
const {query} = require('./ms_database.js');

/** Returns either the provided jsonwebtoken or undefined.
*@param {object} req - HTTP request
*@param {String} req.headers.authorization - authorization of JWT.
*/
function extractToken(req) {
  const bearerHeader = req.headers['authorization'];
  return (bearerHeader != null) ? bearerHeader.split(' ')[1] : undefined;
}

/**If a JWT is successfully extracted from the Authorization header it is verified.
* Successful verification envokes next();. Invalid tokens return a 404 status
* and the error message in JSON format.
*@param {Object} req - HTTP request
*@param {String} req.token - jwt header
*@param {Object} req.tokenPayload - jwt payload
*@param {Object} res - res object represents HTTP response that's sent when it gets an HTTP request.
*/
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

/**
*Searches for user using name provided in request
*If user exists bcrypt will compare the plain text password and the hashed one
*Successful login returns a JWT to validate future requests
*If user doesn't exist 404 Not Found is returned
*If password is wrong 403 Forbidden is returned
*If the query fails a 500 Internal Server Error is returned
*req.body must include username and password
*@param {Object} req - HTTP request
*@param {String} req.body.username - Username of user.
*@param {String} req.body.password - password of user.
*@param {Object} user - account object passed from ms_database
*@param {String} user.account_username - username of account from ms_database
*@param {String} user.account_password - passwrod of account rfom ms_database
*@param {Integer} user.account_id - ID of account used by the database
*@param {Boolean} user.admin_status - Boolean of whether account is admin or not.
*@param {Object} res - res object represents HTTP response that's sent when it gets an HTTP request.
*/
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

/** Uses the private RSA key to sign a JWT with a 1 day expiration
*/
function generateToken(data) {
  return jwt.sign({data}, PRIVATE_KEY, {algorithm: 'RS256', expiresIn: '1d'});
}

/**
Uses a blowfish cypher encryption method to secure the passwords that will be stored
Salt is left at the default of ten to provide a middle ground between security and speed
*/
async function hashPassword(req, res, next) {
  if (req.body.password) {
    try {
      req.body.password = await bcrypt.hash(req.body.password, 10);
      next();
    } catch(err) {
      res.sendStatus(400);
    }
  } else {
    res.sendStatus(400);
  }
}

module.exports = {extractToken, validateSession, validateLogin, hashPassword};
