/* global getUserSchedule, deleteFromSchedule, module */


/**
 * @module Profile Page
 */

const el = {};
let recipes;


/**
 * loadPrompt - If the user has no scheduled recipes this will load a prompt
 * text box telling the user this and given them a link to the search page
 *
 */
function loadPrompt() {
  const promptContainer = document.createElement('div');
  promptContainer.classList.add('recipe', 'promptContainer');
  el.recipeTitle.append(promptContainer);

  const promptHeader = document.createElement('h3');
  promptHeader.classList.add('recipeTitle');
  promptHeader.textContent = "It seems you don't have any recipes scheduled!";
  promptContainer.append(promptHeader);

  const promptRedirect = document.createElement('a');
  promptRedirect.href = '/';
  promptContainer.append(promptRedirect);

  const promptContent = document.createElement('p');
  promptContent.textContent = 'Click to begin searching';
  promptRedirect.append(promptContent);
}


/**
 * loadRecipes - If the user does have recipes scheduled this function will
 * procedurally generate div HTLMelements containing the users recipes
 *
 * Underneath the recipe description is a button that will remove the recipe
 * from the user's schedule and reload the page with the updated information
 *
 */
function loadRecipes() {
  for (const recipe of recipes){
    let recipeIDClass = `recipeID${recipe.recipe_id}`;
    const recipeContainer = document.createElement("div");
    recipeContainer.classList.add(
      'recipe',
      'recipeContainer',
      'recipeEventListener',
      recipeIDClass
    );
    el.recipeTitle.append(recipeContainer);

    const recipeHeader = document.createElement("h3");
    recipeHeader.classList.add(
      'recipeTitle',
      'recipeEventListener',
      recipeIDClass
    );
    recipeHeader.innerHTML = recipe.recipe_name;
    recipeContainer.append(recipeHeader);

    const recipeTime = document.createElement("p");
    recipeTime.id = "recipe-time";
    recipeTime.classList.add(
      'recipeEventListener',
      recipeIDClass
    );
    let scheduleTime = recipe.scheduled_time;
    scheduleTime = new Date(scheduleTime).toLocaleString('en-GB', {timeZone: 'UTC'});
    // scheduleTime = `${scheduleTime.getFullYear()}-${scheduleTime.getMonth()+1}-${scheduleTime.getDate()} - ${scheduleTime.getHours()}:${scheduleTime.getMinutes()}`;
    // Sat Mar 28 2020 21:53:27 GMT+0000 (Greenwich Mean Time)
    recipeTime.innerHTML = scheduleTime;
    recipeContainer.append(recipeTime);

    const ingredientTitle = document.createElement("h4");
    ingredientTitle.classList.add(
      'ingredientTitle',
      'recipeEventListener',
      recipeIDClass
    );
    ingredientTitle.textContent = "Ingredients:";
    recipeContainer.append(ingredientTitle);

    const recipeIngredients = document.createElement("ul");
    recipeIngredients.id = 'recipeIngredient';
    recipeIngredients.classList.add(
      'recipeEventListener',
      recipeIDClass
    );
    recipeContainer.append(recipeIngredients);

    for (const ingredient of recipe.recipe_ingredients){
      const recipeIngredient = document.createElement("li");
      recipeIngredient.innerHTML = ingredient;
      recipeIngredient.classList.add(
        'ingredientList',
        'recipeEventListener',
        recipeIDClass
      );
      recipeContainer.append(recipeIngredient);
    }

    //removeButton

    const recipeRemove = document.createElement("button");
    recipeRemove.textContent = "Remove Recipe";
    recipeRemove.classList.add(
      'recipeRemoveBtn',
      'recipeRemove',
      recipeIDClass
    );
    // recipeContainer.append(recipeRemove);
    recipeRemove.addEventListener('click', removeRecipeHandler);

    recipeContainer.insertAdjacentElement('afterend', recipeRemove);


    }

    document.querySelectorAll('.recipeEventListener').forEach(elem => {
      elem.addEventListener('click', linkHandler);
    });
  }



/**
 * removeRecipeHandler - Event handler for when a user wishes to remove a recipe
 * from their schedule
 *
 * @event
 * @param  {object} MouseEvent description
 */
async function removeRecipeHandler(e){
  const chosenRecipe = getRecipeFromEvent(e);
  const token = window.localStorage.getItem('jwt');
  try {
    if (!token) throw new Error('No JWT found');
    const data = {
      recipe_id: chosenRecipe.recipe_id,
      scheduled_time: chosenRecipe.scheduled_time
    };
    await deleteFromSchedule(data, token);
    location.reload();
  } catch(err) {
    console.log(err);
  }
}


/**
 * getRecipeFromEvent - This function uses the target element's classList
 * to extract the id of the recipe to be removed. This id is then used to search
 * the recipe object that populated the screen before finally requesting the
 * server delete the recipe from the user's schedule
 *
 * @param  {object} MouseEvent description
 * @returns {object} An object containing the details of a recipe
 */
function getRecipeFromEvent(e) {
  const elementClassList = e.target.classList;
  let recipeID;
  elementClassList.forEach(elementClass => {
    if (elementClass.includes('recipeID')) {
      recipeID = elementClass.replace('recipeID', '');
    }
  });

  recipeID = parseInt(recipeID, 10);
  const chosenRecipe = recipes.find(recipe => recipe.recipe_id === recipeID);

  return chosenRecipe;
}


/**
 * linkHandler - When user clicks on a recipe this will save that recipe in
 * localStorage and redirect the user to the recipe page
 *
 * @param  {object} MouseEvent description
 */
function linkHandler(e){
  const chosenRecipe = getRecipeFromEvent(e);
  window.localStorage.setItem('chosenRecipe', JSON.stringify(chosenRecipe));
  window.location.href = 'recipe.html';
}


/**
 * getSchedule - Requests the user's schedule from the server if a validation
 * JWT is present in localStorage
 *
 * @returns {object[]} Each object contains a recipe
 */
async function getSchedule() {
  const token = window.localStorage.getItem('jwt');
  try {
    if(!token) window.location.href = '/';
    const schedule = await getUserSchedule(token);
    return schedule;
  } catch(err) {
    console.log(err);
  }
}


/**
 * prepareHandles - Collects elements from the document page
 *
 */
function prepareHandles() {
  el.recipeTitle = document.querySelector('#recipePlaceholder');
}


/**
 * pageLoaded - This function is triggered when the page loads to prepare the
 * necessary data and HTMLelements
 *
 */
async function pageLoaded() {
  prepareHandles();
  recipes = await getSchedule();
  if(recipes) loadRecipes();
  else loadPrompt();
}

window.addEventListener('load', pageLoaded);

if (typeof module === 'object'){
  module.exports = {el, pageLoaded};
}
