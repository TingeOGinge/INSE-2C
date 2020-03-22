const {query} = require('./ms_database');

async function collectRecipes(searchObj, res) {
  try {
    if (searchObj.parameters) {
      const result = await query('mainSearch', searchObj.parameters);
      return result.rows;
    } else {
      res.sendStatus(400);
    }
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

  if ((searchObj.calories && recipe.recipe_calories > searchObj.calories) ||
      (searchObj.serving && recipe.recipe_serving_size < searchObj.serving) ||
      (searchObj.time && recipe.cooking_minutes > searchObj.time))
      {
    return false;
  }

  return true;
}

function prioritySort(recipes, searchObj) {
  for (const recipe of recipes) {
    recipe.score = searchObj.parameters.length * 2;
    let ingredientsRemaining = recipe.recipe_ingredients.length;

    for (const item of searchObj.parameters) {
      if (recipe.recipe_name.includes(item)) recipe.score -= 1;

      for (const ingredient of recipe.recipe_ingredients) {
        if (ingredient.includes(item)) {
          recipe.score -= 1;
          ingredientsRemaining -= 1;
          break;
        }
      }
    }
    recipe.score += ingredientsRemaining / 10;
    if (searchObj.serving) {
      recipe.score += (recipe.recipe_serving_size - searchObj.serving) / 5;
    }
  }
  return recipes.sort((a, b) => a.score - b.score);
}

async function search(req, res) {
  try {
    const searchObj = req.body;
    const recipes = await collectRecipes(searchObj, res);

    if (recipes && recipes.length > 0) {
      const retval = recipes.filter(recipe => filterRecipe(recipe, searchObj));
      if (retval.length === 0) res.sendStatus(404);
      else {
        prioritySort(retval, searchObj);
        res.json(retval);
      }
    } else {
      res.sendStatus(404);
    }


  } catch (err) {
    console.log(err.stack);
  }
}

module.exports = {search};
