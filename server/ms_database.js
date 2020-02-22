const {Pool} = require('pg');

const connectionString = 'postgresql://james:inse2c@localhost:5432/ecochefdb';

//connect
const pool = new Pool({
  connectionString
});

const queryDictionary = {
  searchAccountName: 'SELECT * FROM account WHERE account_username = $1',
  createAccount: 'INSERT INTO account (account_username, account_password) values($1, $2)',
  removeAccount: 'DELETE FROM account WHERE account_id = $1 AND account_username = $2',
  searchRecipeName: 'SELECT * FROM recipe WHERE recipe_name like $1',
  searchRecipeIngredients: 'select * ' +
                            'from recipe a ' +
                            'left join recipe_ingredient b on a.recipe_id = b.recipe_id ' +
                            'left join ingredient c on b.ingredient_id = c.ingredient_id ' +
                            'where ingredient_name similar to $1',
  scheduleRecipe: 'INSERT INTO account_recipe (account_id, recipe_id, scheduled_time) values($1, $2, $3)'
}

async function query(queryFlag, parameters) {
  if (!Array.isArray(parameters)) parameters = [parameters];
  if (queryFlag === 'searchByIngredients') parameters = `%(${parameters.join('|')})%`;

  const client = await pool.connect();
  try {
    const queryString = queryDictionary[queryFlag]
    if (queryString) {
      const res = await client.query(queryString, parameters);
      return res;
    } else {
        throw new Error('queryFlag not recognised');
    }
  } catch (err) {
    console.log(err.stack);
  } finally {
    client.release();
  }
}


 /* const { Client } = require('pg');

//Connect
const client = new Client({
    user: 'James',
    host: 'http://127.0.0.1//',
    database: 'EcoChefDB',
    password: 'inse2cjames',
    port: 5432,
  })
client.connect();


// Testing with a current time query
client.query('SELECT NOW()', (err, res) => {
    console.log(err, res);
    client.end();
  })

  */module.exports = {query};
