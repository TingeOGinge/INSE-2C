// Users currently stored in local memory for testing purpose
// Will integrate with EcoChef_DB when it is ready
const users = [];

async function registerUser(req, res) {
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
  user.scheduledRecipes.push({
    recipeID: req.body.recipeID,
    scheduledTime: req.body.scheduledTime
  });
  res.sendStatus(200);
}

function retrieveUserSchedule(req, res) {
  const user = users.find(user => user.username === req.body.tokenData.username);
  res.json(user.scheduledRecipes);
}

module.exports = {users, registerUser, scheduleRecipe, retrieveUserSchedule};
