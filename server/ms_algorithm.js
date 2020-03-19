const {query} = require('./ms_database');

async function collectRecipes(searchObj, res) {
  try {
    const result = await query('mainSearch', searchObj.parameters);
    return result.rows;
  } catch(err) {
    console.log(err.stack);
    res.sendStatus(500);
  }
}

function filterRecipe(recipe, searchObj) {
  for (const restriction of searchObj.restrictions) {
    if (!(recipe.dietary_restrictions.includes(restriction))) {
      return false;
    }
  }

  if (searchObj.calories && recipe.recipe_calories > searchObj.calories) {
    return false;
  }

  if (searchObj.serving && recipe.recipe_serving_size < searchObj.serving) {
    return false;
  }

  if (searchObj.time && recipe.cooking_minutes > searchObj.time) {
    return false;
  }

  return true;
}

async function search(req, res) {
  try {
    const searchObj = req.body;
    let recipes = await collectRecipes(searchObj, res);

    if (recipes.length > 0) {
      recipes = recipes.filter(recipe => filterRecipe(recipe, searchObj));
      res.json(recipes);
    } else {
      res.sendStatus(404);
    }

  } catch (err) {
    console.log(err.stack);
    res.sendStatus(500);
  }
}

module.exports = {search};
