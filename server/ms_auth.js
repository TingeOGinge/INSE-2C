const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');
const PRIVATE_KEY = fs.readFileSync(path.join(__dirname, 'private.key'), 'utf-8');
const {query} = require('./ms_database.js');

function extractToken(req) {
  const bearerHeader = req.headers['authorization'];
  return (bearerHeader != null) ? bearerHeader.split(' ')[1] : undefined;
}

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
        res.token = generateToken(payload.data);
        next();
      }
    });
  }
}

async function validateLogin (req, res) {
  try {
    const queryResponse = await query('searchAccountName', req.body.username);
    const user = queryResponse.rows[0];
    if (user == null) {
      res.sendStatus(404);
    } else if (await bcrypt.compare(req.body.password, user.account_password)) {
      res.status(200);
      const token = generateToken({
        account_username: user.account_username,
        account_id: user.account_id
      });
      res.json({token});
    } else {
      res.sendStatus(403);
    }
  } catch (err) {
    console.log(err.stack);
    res.sendStatus(500);
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
