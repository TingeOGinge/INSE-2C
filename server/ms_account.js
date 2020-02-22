// Users currently stored in local memory for testing purpose
// Will integrate with EcoChef_DB when it is ready
const users = [];

function registerUser(req, res) {
  const user = users.find(user => user.username === req.body.username);
  if (user) {
    return res.sendStatus(409);
  } else {
      const user = {
        username: req.body.username,
        password: req.body.password,
        scheduledRecipes: []
      };
      users.push(user);
      res.sendStatus(201);
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

module.exports = {users, registerUser, scheduleRecipe, retrieveUserSchedule};
