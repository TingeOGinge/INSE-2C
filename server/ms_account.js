const {query}  = require('./ms_database.js');

/**RegisterUser attempts to register a user. Undefined response from the query
* indicates the username has already been registered. If the query fails a 500
* Internal Server Error is returned. req.body must contain username and password.
*
* @param req.body.username - the username is passed from ms_entry
* @param req.body.password - the password is passed from ms_entry
* @param res - res object represents HTTP response that'0s sent when it gets an HTTP request.
*/
async function registerUser(req, res) {
  try {
    if (req.body.username && req.body.password) {
      const params = [req.body.username, req.body.password];
      const result = await query('createAccount', params);
      (result) ? res.sendStatus(201) : res.sendStatus(409);
    } else {
      res.sendStatus(400);
    }

  } catch (err) {
    console.log(err.stack);
    res.sendStatus(500);
  }
}

// Attempts to schedule a recipe at a specific time (ISO 8601 format)
// User cannot schedule the a recipes twice at the same time, 409 returned if attempted
// 500 Internal Server Error returned if query fails
// req.body must include recipe_id and scheduled_time

/** Attempts to schedule a recipe at a specific time (ISO 8601 format). User
*cannot schedule the recipes at the same time slot, 409 returned if attempted.
*500 Internal Server Error returend if query fails
*req.body must include recipe_id and scheduled_time.
*@param req.tokenPayload.account_id - Account ID passed from ms_entry
*@param req.body.recipe_id - recipe ID passed from ms_entry
*@param req.body.scheduled_time - scheduled time passed from ms_entry
*@param res - res object represents HTTP response that'0s sent when it gets an HTTP request.
*/

async function scheduleRecipe(req, res) {
  try {
    if (!(req.tokenPayload.account_id &&
        req.body.recipe_id &&
        req.body.scheduled_time))
        {
          res.sendStatus(400);
    } else {
      const params = [
        req.tokenPayload.account_id,
        req.body.recipe_id,
        req.body.scheduled_time
      ];
      const result = await query('scheduleRecipe', params);
      (result) ? res.sendStatus(200) : res.sendStatus(409);
    }
  } catch (err) {
    console.log(err.stack);
    res.sendStatus(500);
  }
}

// Attempts to delete a recipe scheduled for a specific time
// Successful queries return 200
// Unsuccessful queries for 404 Not found
// Failed queries return 500 Internal Server Error
// req.body must contain recipe_id and scheduled time (ISO 8601)
async function deleteFromSchedule(req, res) {
  try {
    const params = [
      req.tokenPayload.account_id,
      req.body.recipe_id,
      req.body.scheduled_time
    ];
    const result = await query('deleteFromSchedule', params);
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
