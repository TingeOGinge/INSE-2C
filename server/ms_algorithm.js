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
  while(recipe.dietary_restrictions.includes(null)) {
    let nullIndex = recipe.dietary_restrictions.indexOf(null);
    recipe.dietary_restrictions.splice(nullIndex, 1);
  }

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

function convertQueryFormats(searchObj) {
  if (searchObj.parameters && !Array.isArray(searchObj.parameters)) {
    searchObj.parameters = searchObj.parameters.split(',');
  }
  if (searchObj.calories && Number.isInteger(searchObj.caloreis)) {
     searchObj.calories = Number(searchObj.calories);
   }
  if (searchObj.serving && Number.isInteger(searchObj.caloreis)) {
     searchObj.serving = Number(searchObj.serving);
   }
  if (searchObj.time && Number.isInteger(searchObj.caloreis)) {
     searchObj.time = Number(searchObj.time);
   }
  if (searchObj.restrictions && !Array.isArray(searchObj.restrictions)) {
    searchObj.restrictions = [searchObj.restrictions];
  }
}

async function search(req, res) {
  try {
    const searchObj = req.query;
    convertQueryFormats(searchObj);
    const recipes = await collectRecipes(searchObj, res);

    if (recipes && recipes.length > 0) {
      const retval = recipes.filter(recipe => filterRecipe(recipe, searchObj));
      if (retval.length === 0) res.sendStatus(404);
      else {
        prioritySort(retval, searchObj);

        res.json((retval.length < 20) ? retval : retval.slice(0, 20));
      }
    }
    else {
      res.end();
    }
  } catch (err) {
    console.log(err.stack);
  }
}

module.exports = {search};
module.exports = {search, filterRecipe, prioritySort};
