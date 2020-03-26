/** @module ms_algorithm
*/

const {query} = require('./ms_database');

/**
* collectRecipes searches the database for recipes and dietary restrictions
* given by the search obj parameter. It returns rows found in the database.
* If the query fails a 50 Internal Server Error is returned.
*@param {Object} searchObj - Search parameter object passed by search function.
*@param {Array} searchObj.parameters - Recipe / ingredient name(s)
*@param {Integer} searchObj.calories - (optional) Calories of a recipe
*@param {Integer} searchObj.serving - (optional) Serving size
*@param {Integer} searchObj.time - (optional) Cooking time
*@param {Array} searchObj.restrictions - (optional) Dietary restrictions such as alergies
*@param {Object} res - res object represents HTTP response that's sent when it gets an HTTP request.
*/

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

/** filterRecipe filters given recipes firstly by returning False if
*dietary restrictions are not met. Secondly, returning false if there are
* too many calories, too small of a serving size and if cooking time is too long.
*Otherwise it returns True
*@param {Object} recipe - Recipe object returned from collectRecipes
*@param {Integer} recipe.recipe_id - ID of recipe
*@param {String} recipe.recipe_name - Name of recipe
*@param {Integer} recipe.cooking_minutes - Time to cook recipe in minutes
*@param {Array} recipe.recipe_method - Instructions on how to cook the recipes
*@param {Array} recipe.recipe_ingredient - List of ingredients in the recipes
*@param {Integer} recipe.recipe_serving_size - How many people the recipe serves
*@param {Integer} recipe.recipe_calories - How many calories the recipe contains
*@param {Array} recipe.diet_restrictions -  Dietary restrictions such as alergies
*@param {Object} searchObj - Search parameter object passed by search function.
*@param {Array} searchObj.parameters - Recipe / ingredient name(s)
*@param {Integer} searchObj.calories - (optional) Calories of a recipe
*@param {Integer} searchObj.serving - (optional) Serving size
*@param {Integer} searchObj.time - (optional) Cooking time
*@param {Array} searchObj.restrictions - (optional) Dietary restrictions such as alergies
*@param {Object} res - res object represents HTTP response that's sent when it gets an HTTP request.
*/

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

/** prioritySort has a score in which to sort recipes. The score is initialised
*based on the length of the recipe/ingredients array. It then goes through and matches
*ingredients from the search obj to the recipe adjusting the score accordingly. Next
*it makes sure the serving size of the recipe is inline with the one in the search
*object but this has a lower piroty. Lastly the recipes are sorted by which has
the lowest score. Aka the best match.
*@param {Object} recipe - Recipe object returned from collectRecipes
*@param {Integer} recipe.score - Score used by the algorithm to best sort matches
*@param {Integer} recipe.recipe_id - ID of recipe
*@param {String} recipe.recipe_name - Name of recipe
*@param {Integer} recipe.cooking_minutes - Time to cook recipe in minutes
*@param {Array} recipe.recipe_method - Instructions on how to cook the recipes
*@param {Array} recipe.recipe_ingredient - List of ingredients in the recipes
*@param {Integer} recipe.recipe_serving_size - How many people the recipe serves
*@param {Integer} recipe.recipe_calories - How many calories the recipe contains
*@param {Array} recipe.diet_restrictions -  Dietary restrictions such as alergies
*@param {Object} searchObj - Search parameter object passed by search function.
*@param {Array} searchObj.parameters - Recipe / ingredient name(s)
*@param {Integer} searchObj.calories - (optional) Calories of a recipe
*@param {Integer} searchObj.serving - (optional) Serving size
*@param {Integer} searchObj.time - (optional) Cooking time
*@param {Array} searchObj.restrictions - (optional) Dietary restrictions such as alergies
*/

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


/**
*search uses collectRecipes and filterRecipes to return sorted recipes. It does
* this by first calling collectRecipes then filters recipes using filterRecipe.
*Lastly it uses prioritySort and returns the sorted recipes.

*@param {Object} recipe - Recipe object returned from collectRecipes
*@param {Integer} recipe.score - Score used by the algorithm to best sort matches
*@param {Integer} recipe.recipe_id - ID of recipe
*@param {String} recipe.recipe_name - Name of recipe
*@param {Integer} recipe.cooking_minutes - Time to cook recipe in minutes
*@param {Array} recipe.recipe_method - Instructions on how to cook the recipes
*@param {Array} recipe.recipe_ingredient - List of ingredients in the recipes
*@param {Integer} recipe.recipe_serving_size - How many people the recipe serves
*@param {Integer} recipe.recipe_calories - How many calories the recipe contains
*@param {Array} recipe.diet_restrictions -  Dietary restrictions such as alergies
*@param {Object} req.body - contains searchObj
*@param {Object} searchObj - Search parameter object passed by search function.
*@param {Array} searchObj.parameters - Recipe / ingredient name(s)
*@param {Integer} searchObj.calories - (optional) Calories of a recipe
*@param {Integer} searchObj.serving - (optional) Serving size
*@param {Integer} searchObj.time - (optional) Cooking time
*@param {Array} searchObj.restrictions - (optional) Dietary restrictions such as alergies
*@param {Object} res - res object represents HTTP response that's sent when it gets an HTTP request.
*/

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

async function getRecipe(req, res) {
  const id = req.params.id;
  try {
    const recipe = await query('searchRecipeID', id);
    (recipe.rows.length > 0) ? res.json(recipe.rows[0]) : res.sendStatus(404);
  } catch(err) {
    res.sendStatus(404);
  }
}

module.exports = {search, filterRecipe, prioritySort, getRecipe};
