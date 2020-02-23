/*
TO do for James
add delete recipe from schedule,
add search schedule (print schedule)
seperate test functions into seperate test directory
*/

const {Pool} = require('pg');

const connectionString = 'postgresql://james:inse2c@localhost:5432/ecochefdb';

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
  getUsers: 'TABLE account'
};

async function query(queryFlag, parameters) {
  if (!Array.isArray(parameters)) parameters = [parameters];
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





//----------------------------------------------------



/* BELOW FUNCTIONS ARE FOR TESTING THE DATABASE API */


//----------------------------------------------------


async function getUserWithValidAccName() {
  try {
    console.log('Test Getting user with Account Name');
    console.log('Using valid name');
    const response = await query('searchAccountName','James');
    console.log(response.rows[0]);
  } catch (err) {
    console.log(err.stack);
  }
}

async function getUserWithInvalidAccName() {
  try {
    console.log('Using invalid name');
    const response = await query('searchAccountName','Boogeyman');
    console.log(response);
  } catch (err) {
    console.log(err.stack);
  }
}

async function createAccountValid() {
  try {
    console.log('Create Account');
    console.log('Valid attempt');
    await query('createAccount', ['Tiago', 'myhashedpassword']);
    const response = await query('searchAccountName', 'Tiago');
    console.log(response.rows[0]);
  } catch (err) {
    console.log(err.stack);
  }

}

async function createAccountDuplicate() {
  try {
    console.log('Duplicate attempt');
    await query('createAccount', ['Tiago', 'myhashedpassword']);
    const response = await query('searchAccountName', 'Tiago');
    console.log(response.rows[0]);
  } catch (err) {
    console.log(err.stack);
  }

}

async function deleteUserValid() {
  try {
    console.log('Delete user');
    console.log('Valid attempt');
    const userID = await query('getUserID', 'Tiago');
    await query('removeAccount', [userID.account_id, 'Tiago']);
    const response = await query('searchAccountName', 'Tiago');
    console.log(response.rows[0]);
  } catch (err) {
    console.log(err.stack);
  }

}

async function deleteUserInvalid() {
  try {
    console.log('Delete user');
    console.log('invalid attempt');
    await query('removeAccount', ['1', 'Tiago']);
    const response = await query('searchAccountName', 'Tiago');
    console.log(response.rows[0]);
  } catch (err) {
    console.log(err.stack);
  }

}

async function searchRecipeNameValid() {
  try {
    console.log('Search recipe by name');
    console.log('Valid attempt');
    const response = await query('searchRecipeName','hummus');
    console.log(response.rows);
  } catch (err) {
    console.log(err.stack);
  }

}

async function searchRecipeNameInvalid() {
  try {
    console.log('Invalid attempt');
    const response = await query('searchRecipeName','KFC');
    console.log(response.rows);
  } catch (err) {
    console.log(err.stack);
  }
}

async function searchRecipeIngredientValid() {
  try {
    console.log('Search recipe by ingredient');
    console.log('valid attempt');
    const response = await query('searchRecipeIngredients', 'onion');
    console.log(response.rows);
  } catch (err) {
    console.log(err.stack);
  }
}

async function searchRecipeIngredientInvalid() {
  try {
    console.log('invalid attempt');
    const response = await query('searchRecipeIngredients', 'beans');
    console.log(response.rows);
  } catch (err) {
    console.log(err.stack);
  }
}

async function scheduleRecipeValid(){
  try {
    console.log('Schedule recipe');
    console.log('valid attempt');
    const response = await query('scheduleRecipe', ['1', '1', '2020-05-01 10:00:00']);
    console.log(response.rows);
  } catch (err) {
    console.log(err.stack);
  }
}

async function scheduleRecipeInvalid() {
  try {
    console.log('invalid attempt');
    const response = await query('scheduleRecipe', ['1', '5', '2020-06-05 10:00:00']);
    console.log(response.rows);
  } catch (err) {
    console.log(err.stack);
  }
}

async function test() {
  const testFunctions = [
    getUserWithValidAccName,
    getUserWithInvalidAccName,
    createAccountValid,
    createAccountDuplicate,
    deleteUserValid,
    deleteUserInvalid,
    searchRecipeNameValid,
    searchRecipeNameInvalid,
    searchRecipeIngredientValid,
    searchRecipeIngredientInvalid,
    scheduleRecipeValid,
    scheduleRecipeInvalid
  ];

  for (const func of testFunctions) {
    try {
      await func.call();
    } catch (err) {
      console.log(err.stack);
    }
  }
  pool.end();

}



// test();
module.exports = {query};
