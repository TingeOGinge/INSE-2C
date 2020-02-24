const {query}  = require('./ms_database.js');

async function registerUser(req, res) {
  try {
    const params = [req.body.username, req.body.password];
    const queryResponse = await query('createAccount', params);
    (queryResponse) ? res.sendStatus(201) : res.sendStatus(409);
  } catch (err) {
    console.log(err.stack);
    res.sendStatus(500);
  }
}

async function scheduleRecipe(req, res) {
  try {
    const params = [
      req.tokenPayload.account_id,
      req.body.recipe_id,
      req.body.scheduled_time
    ];
    const queryResponse = await query('scheduleRecipe', params);
    (queryResponse) ? res.sendStatus(200) : res.sendStatus(409);
  } catch (err) {
    console.log(err.stack);
    res.sendStatus(500);
  }

}

async function retrieveUserSchedule(req, res) {
  try {
    const queryResponse = await query('getUserSchedule', req.tokenPayload.account_id);
    (queryResponse.rows.length > 0) ? res.json(queryResponse.rows) : res.sendStatus(404);
  } catch (err) {
    console.log(err.stack);
    res.sendStatus(500);
  }
}

async function getUsers(req, res) {
  try {
    const queryResponse = await query('getUsers');
    res.send(queryResponse.rows);
  } catch (err) {
    console.log(err.stack);
    res.sendStatus(500);
  }
}

module.exports = {registerUser, scheduleRecipe, retrieveUserSchedule, getUsers};
