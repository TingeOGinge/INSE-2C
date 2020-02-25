const {query}  = require('./ms_database.js');

// Attempts to register a user
// Undefined response from the query indicates the username has already been registered
// If the query fails a 500 Internal Server Error is returned
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

// Attempts to schedule a recipe at a specific time (ISO 8601 format)
// User cannot schedule the a recipes twice at the same time, 409 returned if attempted
// 500 Internal Server Error returned if query fails
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

// Attempts to delete a recipe scheduled for a specific time
// Successful queries return 200
// Unsuccessful queries for 404 Not found
// Failed queries return 500 Internal Server Error
async function deleteFromSchedule(req, res) {
  try {
    const params = [
      req.tokenPayload.account_id,
      req.body.recipe_id,
      req.body.scheduled_time
    ];
    const result = await query('deleteFromSchedule', params);
    console.log(result);
    (result.rowCount > 0) ? res.sendStatus(200) : res.sendStatus(404);
  } catch (err) {
    console.log(err.stack);
    res.sendStatus(500);
  }
}

// Retrieves recipe information from user's schedule
// 404 Not found returned if user has not scheduled any recipes or user does not exist
// 500 Internal Server Error if query fails
async function retrieveUserSchedule(req, res) {
  try {
    const result = await query('getUserSchedule', req.tokenPayload.account_id);
    (result.rows.length > 0) ? res.json(result.rows) : res.sendStatus(404);
  } catch (err) {
    console.log(err.stack);
    res.sendStatus(500);
  }
}


//------------------------------------------------------------------------------
// Test function to retrieve all information on a user
// DELETE BEFORE RELEASING PROTOTYPE \/ \/ \/ \/ \/ \/ \/ \/ \/ \/ \/ \/ \/ \/
//------------------------------------------------------------------------------
async function getUsers(req, res) {
  try {
    if (req.tokenPayload.admin_status) {
      const result = await query('getUsers');
      (result) ? res.send(result.rows) : res.sendStatus(404);
    } else {
      res.sendStatus(404);
    }
  } catch (err) {
    console.log(err.stack);
    res.sendStatus(500);
  }
}
//------------------------------------------------------------------------------
// Test function to retrieve all information on a user ^^^^^^^^^^^^^^^^^^^^^^^^
// DELETE BEFORE RELEASING PROTOTYPE
//------------------------------------------------------------------------------

module.exports = {
  registerUser,
  scheduleRecipe,
  retrieveUserSchedule,
  getUsers,
  deleteFromSchedule
};
