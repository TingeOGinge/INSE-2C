const {query} = require('../ms_database.js');
const {Pool} = require('pg');

const TIMESTAMP = new Date();

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
    const response = await query('scheduleRecipe', ['2', '2', TIMESTAMP]);
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

async function getUserScheduleValid() {
  try {
    console.log('Get Users Schedule');
    console.log('Valid attempt');
    const response = await query('getUserSchedule', '2' );
    console.log(response.rows);
  } catch (err) {
    console.log(err.stack);
  }
}

async function getUserScheduleInvalid() {
  try {
    console.log('Invalid attempt');
    const response = await query('getUserSchedule', '400' );
    console.log(response.rows);
  } catch (err) {
    console.log(err.stack);
  }
}

async function deleteFromScheduleValid() {
  try {
    console.log('Delete From Schedule');
    console.log('Valid attempt');
    const response = await query('deleteFromSchedule', ['2', '2', TIMESTAMP]);
    console.log(response.rows)
  } catch (err) {
    console.log(err.stack)
  }
}

async function deleteFromScheduleInvalid() {
  try {
    console.log('Delete From Schedule');
    console.log('Invalid attempt');
    const response = await query('deleteFromSchedule', ['2', '2', '2020-06-05 10:00:00']);
    console.log(response.rows)
  } catch (err) {
    console.log(err.stack)
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
    scheduleRecipeInvalid,
    getUserScheduleValid,
    getUserScheduleInvalid,
    deleteFromScheduleValid,
    deleteFromScheduleInvalid
  ];

  for (const func of testFunctions) {
    try {
      await func.call();
    } catch (err) {
      console.log(err.stack);
    }
  }
}

test();
