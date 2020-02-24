/*
TO do for James
[x] add delete recipe from schedule,
[x] add search schedule (print schedule)
[x] seperate test functions into seperate test directory
[x] alter account_recipe table to create composite key from (account_id, recipe_id, scheduled_time)
*/

const {Pool} = require('pg');

const connectionString = 'postgresql://myuser:inse2c@localhost:5432/ecochefdb';

//connect
const pool = new Pool({
  connectionString
});

const queryDictionary = {
  searchAccountName: 'SELECT * FROM account WHERE account_username = $1',
  getUserID: 'SELECT account_id FROM account WHERE account_username = $1',
  createAccount: 'INSERT INTO account (account_username, account_password) values($1, $2)',
  removeAccount: 'DELETE FROM account WHERE account_id = $1 AND account_username = $2',
  searchRecipeName: 'SELECT * FROM recipe WHERE recipe_name like $1',
  searchRecipeIngredients: 'select * ' +
                            'from recipe a ' +
                            'left join recipe_ingredient b on a.recipe_id = b.recipe_id ' +
                            'left join ingredient c on b.ingredient_id = c.ingredient_id ' +
                            'where ingredient_name similar to $1',
  scheduleRecipe: 'INSERT INTO account_recipe (account_id, recipe_id, scheduled_time) values($1, $2, $3)',
  getUsers: 'TABLE account',
  getUserSchedule: 'SELECT recipe_name, scheduled_time, recipe_cooking_time, recipe_serving_size, ' +
					' recipe_calories,STRING_AGG (ingredient_name, \',\') ingredient_name, recipe_method FROM ' +
                    'recipe a ' +
                    'LEFT JOIN account_recipe b ON a.recipe_id = b.recipe_id ' +
					'LEFT JOIN recipe_ingredient c ON a.recipe_id = c.recipe_id ' +
					'LEFT JOIN ingredient d ON c.ingredient_id = d.ingredient_id ' +
                    'WHERE account_id = $1 ' +
					'GROUP BY recipe_name, scheduled_time, recipe_cooking_time, recipe_serving_size, ' +
					'recipe_calories, recipe_method;',
  deleteFromSchedule: 'DELETE from account_recipe WHERE account_id = $1 AND recipe_id = $2 AND scheduled_time = $3'

};

async function query(queryFlag, parameters) {
  if (!parameters) parameters = [];
  else if (!Array.isArray(parameters)) parameters = [parameters];

  if (queryFlag === 'searchByIngredients') parameters = `%(${parameters.join('|')})%`;

  const client = await pool.connect();
  try {
    const queryString = queryDictionary[queryFlag];
    if (!queryString) throw new Error('queryFlag not recognised');
    const res = await client.query(queryString, parameters);
    return res;
    } catch (err) {
    console.log(err.stack);
  } finally {
    client.release();
  }
}

module.exports = {query};
