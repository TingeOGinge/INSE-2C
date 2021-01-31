/**
*@module ms_database
*/

/*
Example query call from external module:

const {query} = require('PATH TO ms_database')
async function foo {
  try {
    const result = await query ('QUERY TYPE', [parameter values]);
    // Handle successful result here
  } catch (err) {
    // Handle error here
  }
}

  If query() is successful a result object will be returned with the following structure
  result = {
    rows: [] -                    Contains the return results from the database
    rowCount: int -               Contains the number of rows (useful for DELETE queries etc)
    command: string -             Contains the type of query executed (SELECT, INSERT, etc)
    fields: [] -                  Contains the name and dataTypeID of each field
}

  If query() fails then 'undefined' is returned
*/

const {Pool} = require('pg');
const pg = require('pg');
let types = pg.types;
types.setTypeParser(1114, function(stringValue) {
  return new Date(stringValue + "+0000");
});

/**
*Connection.
*/

// TODO find a way to load host dynamically 
// Currently only works on this machine on this network
const connectionString = 'postgresql://myuser:inse2c@192.168.0.11:5432/ecochefdb';

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
  getUserSchedule: 'SELECT DISTINCT scheduled_time, recipe_name, a.recipe_id, recipe_cooking_time, recipe_serving_size, ' +
                      ' recipe_calories, recipe_ingredients, recipe_method FROM ' +
                      'recipe a ' +
                    'LEFT JOIN account_recipe b ON a.recipe_id = b.recipe_id ' +
                    'LEFT JOIN recipe_ingredient c ON a.recipe_id = c.recipe_id ' +
                    'LEFT JOIN ingredient d ON c.ingredient_id = d.ingredient_id ' +
                    'WHERE account_id = $1 ' +
                    'AND scheduled_time > now() ' +
          'ORDER BY scheduled_time',
  deleteFromSchedule: 'DELETE from account_recipe WHERE account_id = $1 AND recipe_id = $2 AND scheduled_time = $3',
  mainSearch: 'SELECT ' +
                'DISTINCT a.recipe_id, ' +
                'a.recipe_name, ' +
                'EXTRACT(epoch FROM a.recipe_cooking_time)/60 as cooking_minutes, ' +
                'a.recipe_method, ' +
                'a.recipe_ingredients, ' +
                'a.recipe_serving_size, ' +
                'a.recipe_calories, ' +
                'ARRAY_AGG (DISTINCT e.diet_restriction_name) as dietary_restrictions ' +
              'FROM recipe a ' +
                'LEFT JOIN recipe_ingredient b ON a.recipe_id = b.recipe_id ' +
                'LEFT JOIN ingredient c on b.ingredient_id = c.ingredient_id ' +
                'LEFT JOIN recipe_dietary d on a.recipe_id = d.recipe_id ' +
                'LEFT JOIN dietary_restrictions e on d.diet_restriction_id = e.diet_restriction_id ' +
                'WHERE c.ingredient_name SIMILAR TO $1 ' +
                'OR a.recipe_name SIMILAR TO $1' +
              'GROUP BY a.recipe_id',
  searchRecipeID: 'SELECT ' +
                    'DISTINCT a.recipe_id, ' +
                    'a.recipe_name, ' +
                    'EXTRACT(epoch FROM a.recipe_cooking_time)/60 as cooking_minutes, ' +
                    'a.recipe_method, ' +
                    'a.recipe_ingredients, ' +
                    'a.recipe_serving_size, ' +
                    'a.recipe_calories, ' +
                    'ARRAY_AGG (DISTINCT e.diet_restriction_name) as dietary_restrictions ' +
                  'FROM recipe a ' +
                    'LEFT JOIN recipe_ingredient b ON a.recipe_id = b.recipe_id ' +
                    'LEFT JOIN ingredient c on b.ingredient_id = c.ingredient_id ' +
                    'LEFT JOIN recipe_dietary d on a.recipe_id = d.recipe_id ' +
                    'LEFT JOIN dietary_restrictions e on d.diet_restriction_id = e.diet_restriction_id ' +
                    'WHERE a.recipe_id = $1 ' +
                  'GROUP BY a.recipe_id'
};

/**
*Query takes a flag and parameters and searches the database with a number of premade queries.
*Query flags are selected from a dictionary for user usablility and database security
*@param parameters - Passed from ms_algorithm, ms_auth, ms_account as search paramaters for the database. Different microservices
*use different query flags.
*@param queryFlag - String refers to property of queryDictionary in one of the following formats
*@param queryFlag.searchAccountName - Takes account_username and returns all account information in the account table.
*@param queryFlag.getUserID - Takes account username and returns account_id
*@param queryFlag.createAccount - Creates account in the account table with supplied account_username and account_password
*@param queryFlag.removeAccount - Deletes account from the account table with supplied account_id and account_username
*@param queryFlag.searchRecipeName - Returns all information in the recipe table where recipe_name is like search parameter
*@param queryFlag.searchRecipeIngredients - Returns recipe information where ingredients are matched to the recipe
*@param queryFlag.scheduleRecipe - Creates a scheduled recipe with account_id, recipe_id and a scheduled_time
*@param queryFlag.getUsers - Returns all information on all accounts in account table
*@param queryFlag.getUserSchedule - Returns recipe_name, scheduled_time, recipe_coking_time, recipe_serving_size,
*recipe_calories, recipe_method and ingredient_name array for each scheduled recipe for the acount
*@param queryFlag.deleteFromSchedule - Deletes scheduled recipe identified by account_id, recipe_id and scheduled_time
*@param queryFlag.mainSearch - Returns recipe_id, recipe_name, recipe_coking_time (as minutes), recipe_method, recipe_ingredients
*recipe_serving_size, recipe_calories and dietary_restrictions searched by input similar to ingredient_name or recipe_name
* @returns {Object} node-postgres query object is returned if no error occurs
 */

async function query(queryFlag, parameters) {
  if (!parameters) parameters = [];
  else if (!Array.isArray(parameters)) parameters = [parameters];

  if (['searchRecipeIngredients', 'mainSearch'].includes(queryFlag)) {
    parameters = (parameters.length > 1) ? [`%(${parameters.join('|')})%`] :
                                           [`%${parameters[0]}%`];
  }

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

/**
*poolEnd ends the current pool conection. This main purpose of this is to make sure the connection doesn't reamin
*open for security and performance purposes.
*/
async function poolEnd() {
  try {
    await pool.end();
  } catch (err) {
    console.log(err.stack);
  }
}
module.exports = {query, poolEnd};
