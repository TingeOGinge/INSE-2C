const {query}  = require('./ms_database.js');

async function registerUser(req, res) {
  try {
    const params = [req.body.username, req.body.password];
    const result = await query('createAccount', params);
    (result) ? res.sendStatus(201) : res.sendStatus(409);
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
    const result = await query('scheduleRecipe', params);
    (result) ? res.sendStatus(200) : res.sendStatus(409);
  } catch (err) {
    console.log(err.stack);
    res.sendStatus(500);
  }

}

async function retrieveUserSchedule(req, res) {
  try {
    const result = await query('getUserSchedule', req.tokenPayload.account_id);
    (result.rows.length > 0) ? res.json(result.rows) : res.sendStatus(404);
  } catch (err) {
    console.log(err.stack);
    res.sendStatus(500);
  }
}

async function getUsers(req, res) {
  try {
    const result = await query('getUsers');
    (result) ? res.send(result.rows) : res.sendStatus(404);
  } catch (err) {
    console.log(err.stack);
    res.sendStatus(500);
  }
}

module.exports = {registerUser, scheduleRecipe, retrieveUserSchedule, getUsers};
