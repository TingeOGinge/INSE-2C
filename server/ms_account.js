const {query}  = require('./ms_database.js');

async function registerUser(req, res) {
  try {
    const queryResponse = await query('createAccount', [req.body.username, req.body.password]);
    (queryResponse) ? res.sendStatus(201) : res.sendStatus(409);
  } catch (err) {
    console.log(err.stack);
    res.sendStatus(500);
  }
}

function scheduleRecipe(req, res) {
  const user = users.find(user => user.username === req.body.tokenData.username);
  if (checkScheduleConflict(user.scheduledRecipes, req.body.scheduledTime)) {
    res.sendStatus(409);
  } else {
    user.scheduledRecipes.push({
      recipeID: req.body.recipeID,
      scheduledTime: req.body.scheduledTime
    });
    res.sendStatus(200);
  }
}

function checkScheduleConflict(schedule, proposedTime) {
  const conflict = schedule.find(recipe => recipe.scheduledTime === proposedTime);
  return !(conflict === undefined);
}

function retrieveUserSchedule(req, res) {
  const user = users.find(user => user.username === req.body.tokenData.username);
  res.json({schedule: user.scheduledRecipes, token: res.token});
}

module.exports = {registerUser, scheduleRecipe, retrieveUserSchedule};
