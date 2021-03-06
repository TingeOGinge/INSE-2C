const {Pool} = require('pg');
const parse = require('csv-parse/lib/sync');
const fs = require('fs');
const path = require('path');

const CSV_PARSE_OPTIONS = {
  columns: true,
  skip_empty_lines: true,
  relax: true
};

function parseDataFile(filename) {
  const retval = [];

  const file = fs.readFileSync(path.join(__dirname, '..', 'db-data', filename));
  const data = parse(file, CSV_PARSE_OPTIONS);
  retval.push(...data);
  return retval;
}

function listFromStringRepr(stringRepresentation){
  const retval =  stringRepresentation.replace(/\[|]|\r|"/g, '').split('\', ');
  for (let i = 0; i < retval.length; i++) {
    retval[i] = retval[i].replace(/'/g, '').replace(/ {2}/g, ' ').trim();
    if (retval[i] === '') retval.splice(i, 1);
  }
  return retval;
}

function cleanData(recipes) {
  for (const recipe of recipes){
    recipe.serves = parseInt(recipe.serves);
    recipe.serving_calories = parseInt(recipe.serving_calories);
    recipe.recipe_ingredients = listFromStringRepr(recipe.recipe_ingredients);
    recipe.instructions = listFromStringRepr(recipe.instructions);
    recipe.ingredients = listFromStringRepr(recipe.ingredients);
    recipe.dietary_restrictions = listFromStringRepr(recipe.dietary_restrictions);
  }
  return recipes;
}

async function populateIngredients(ingredients, client) {
  for (const ingredient of ingredients) {
    try {
      await client.query(queries.insertIngredient, [ingredient.ingredient_name]);
    } catch (err) {
      console.log(err.stack);
    }
  }
}

async function populateRecipes(recipes, client) {
  for (const recipe of recipes) {
    try{
      let recipeInfo = [
        recipe.name,
        recipe.serves,
        recipe.cooking_time,
        recipe.recipe_ingredients,
        recipe.instructions,
        recipe.serving_calories
      ];
      let insertResult = await client.query(queries.insertRecipe, recipeInfo);

      if (insertResult.rowCount > 0) {
        let recipeIDResult = await client.query(queries.getRecipeID, [recipe.name]);
        let recipeID = recipeIDResult.rows[0].recipe_id;

        for (const ingredient of recipe.ingredients) {
          let ingredientIDResult = await client.query(queries.getIngredientID, [ingredient]);

          if (ingredientIDResult.rows.length > 0) {
            let ingredientID = ingredientIDResult.rows[0].ingredient_id;
            await client.query(queries.insertRecipeIngredient, [recipeID, ingredientID]);
          }
        }

        for (const restriction of recipe.dietary_restrictions) {
          let dietaryIDResult = await client.query(queries.getDietaryID, [restriction]);
          await client.query(queries.insertRecipeDietary, [recipeID, dietaryIDResult.rows[0].diet_restriction_id]);
        }
      }
    } catch (err) {
      console.log(err.stack);
    }
  }
}

async function populateDietaryRestrictions(data, client) {
  for (const restriction of data) {
    try {
      await client.query(queries.insertDietRestriciton, [restriction.diet_restriction_name]);
    } catch (err) {
      console.log(err.stack);
    }
  }
}

async function main() {
  // TODO find a way to load host dynamically 
  // Currently only works on this machine on this network
  const connectionString = `postgresql://myuser:inse2c@${process.env.DB_HOST}:${process.env.DB_PORT}/ecochefdb`;
  const pool = new Pool({connectionString});
  const client = await pool.connect();

  await populateIngredients(parseDataFile('ingredientCollection.csv'), client);
  await populateDietaryRestrictions(parseDataFile('dietaryCollection.csv'), client);
  const recipes = cleanData(parseDataFile('recipeCollection.csv'));
  await populateRecipes(recipes, client);

  client.release();
  pool.end();
}

main();

const queries = {
  insertRecipe: 'INSERT INTO recipe(' +
          'recipe_name, ' +
          'recipe_serving_size, ' +
          'recipe_cooking_time, ' +
          'recipe_ingredients, ' +
          'recipe_method, ' +
          'recipe_calories' +
          ') values($1, $2, $3, $4, $5, $6)',
  insertIngredient: 'INSERT INTO ingredient(ingredient_name) values($1)',
  insertRecipeIngredient: 'INSERT INTO recipe_ingredient values($1, $2)',
  insertDietRestriciton: 'INSERT INTO dietary_restrictions(diet_restriction_name) values($1)',
  insertRecipeDietary: 'INSERT INTO recipe_dietary(recipe_id, diet_restriction_id) values($1, $2)',
  getIngredientID: 'SELECT ingredient_id from ingredient WHERE ingredient_name = $1',
  getRecipeID: 'SELECT recipe_id from recipe WHERE recipe_name = $1',
  getDietaryID: 'SELECT diet_restriction_id FROM dietary_restrictions WHERE diet_restriction_name = $1'
};
