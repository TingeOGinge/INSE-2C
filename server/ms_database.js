/*
TO do for James
add delete recipe from schedule,
add search schedule (print schedule)
*/

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
};

async function query(queryFlag, parameters) {
  if (!Array.isArray(parameters)) parameters = [parameters];
  if (queryFlag === 'searchByIngredients') parameters = `%(${parameters.join('|')})%`;

  const client = await pool.connect();
  try {
    const queryString = queryDictionary[queryFlag];
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

async function test() {
  try {
    // Test Getting user with Account Name

    // Using valid name
    console.log('Test Getting user with Account Name');
    console.log('Using valid name');
    let response = await query('searchAccountName','James');
    console.log(response.rows[0]);

    // Using invalid Name
    console.log('Using invalid name');
    response = await query('searchAccountName','Boogeyman');
    console.log(response.rows);

    // Using invalid queryFlag - Uncomment to run
    // response = await query('slkduhjslkdfjfh','Boogeyman')
    // console.log(response.rows);

    // Create Account

    //account_id CHANGES ON EACH CREATE. COMMENTED OUT TO
    // KEEP SERIAL LOW

    // Valid attempt
    //console.log('Create Account');
    //console.log('Valid attempt');
    //await query('createAccount', ['Tiago', 'myhashedpassword']);
    //response = await query('searchAccountName', 'Tiago');
    //console.log(response.rows[0]);

    // // Invalid attempt - uncomment to run as error is thrown
    // console.log('Invalid attempt');
    // await query('createAccount', ['Tiago', 'myhashedpassword']);

    // Delete user

    //Valid attempt
    //console.log('Delete user');
    //console.log('Valid attempt');
    //await query('removeAccount', ['10', 'Tiago']);
    //response = await query('searchAccountName', 'Tiago');
    //console.log(response.rows[0]);


    //invalid attempt
    //console.log('Delete user');
    //console.log('invalid attempt');
    //await query('removeAccount', ['9', 'Tiago']);
    //response = await query('searchAccountName', 'Tiago');
    //console.log(response.rows[0]);

    //search recipe Name
    //valid attempt
    console.log('Search recipe by name');
    console.log('Valid attempt');
    response = await query('searchRecipeName','hummus');
    console.log(response.rows);

    //invalid attempt
    console.log('Invalid attempt');
    response = await query('searchRecipeName','KFC');
    console.log(response.rows);


    //Search recipe by ingredient
    // valid attempt
    console.log('Search recipe by ingredient');
    console.log('valid attempt');
    response = await query('searchRecipeIngredients', 'onion');
    console.log(response.rows);

    //invald attempt
    console.log('invalid attempt');
    response = await query('searchRecipeIngredients', 'beans');
    console.log(response.rows);

    //scheduleRecupe
    //valid attempt

    console.log('Schedule recipe');
    console.log('valid attempt');
    response = await query('scheduleRecipe', ['1', '1', '2020-05-01 10:00:00']);
    console.log(response.rows);

    //invalid attempt

    //console.log('invalid attempt');
    //response = await query('scheduleRecipe', ['1', '5', '2020-06-05 10:00:00']);
    //console.log(response.rows);

  } catch (err) {
    console.log(err.stack);
  } finally {
    pool.end();
  }
}



test();
module.exports = {query};
