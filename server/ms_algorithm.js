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
  if (searchObj.restrictions) {
    for (const restriction of searchObj.restrictions) {
      if (!(recipe.dietary_restrictions.includes(restriction))) {
        return false;
      }
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

function prioritySort(recipes, parameters) {
  for (const recipe of recipes) {
    recipe.score = parameters.length * 2;

    for (const item of parameters) {
      if (recipe.recipe_name.includes(item)) recipe.score -= 1;

      for (const ingredient of recipe.recipe_ingredients) {
        if (ingredient.includes(item)) {
          recipe.score -= 1;
          break;
        }
      }
    }
  }
  return recipes.sort((a, b) => a.score - b.score);
}

async function search(req, res) {
  try {
    const searchObj = req.body;
    const recipes = await collectRecipes(searchObj, res);

    if (recipes.length > 0) {
      const retval = recipes.filter(recipe => filterRecipe(recipe, searchObj));
      if (retval.length === 0) res.sendStatus(404);
      prioritySort(retval, searchObj.parameters);
      res.json(retval);
    } else {
      res.sendStatus(404);
    }

  } catch (err) {
    console.log(err.stack);
    res.sendStatus(500);
  }
}

module.exports = {search};
