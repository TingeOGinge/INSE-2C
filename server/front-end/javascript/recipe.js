/* global getRecipe, scheduleRecipe, module */


/**
 * @module Recipe Page
 */

const el = {};
let recipe;


/**
 * prepareHandles - Collects elements from document for manipulation later
 *
 */
function prepareHandles() {
  el.recipeTitle = document.querySelector('#detail');
  el.recipeAbout = document.querySelector('#about');
  el.recipeIngredients = document.querySelector('#ingredients');
  el.recipeMethod = document.querySelector('#method');
  el.dateControl = document.querySelector('input[type="datetime-local"]');
  el.print = document.querySelector('#printButton');
  el.schedule = document.querySelector('#scheduleButton');
  el.scheduleMessage = document.querySelector('#scheduleMessage');
  el.facebookShare = document.querySelector('#shareButton');
}

/**
 * loadRecipes - If the user does have recipes scheduled this function will
 * procedurally generate div HTLMelements containing the users recipes
 *
 * If a user clicks on a recipe they will be redirected to the recipe's page
 *
 */
function loadRecipe(recipe){
  if (recipe != null){
    let ingredient;
    let steps;
    el.recipeTitle.append(recipe.recipe_name);

    const info = {
      "Cooking Time in Minutes": recipe.cooking_minutes,
      "Serving Size": recipe.recipe_serving_size,
      "Calories": recipe.recipe_calories
    };

    if (recipe.dietary_restrictions[0] != null) {
      info["Dietary Restrictions"] = recipe.dietary_restrictions.join(', ')
    }

    for(const [prompt, value] of Object.entries(info)) {
      const infoElement = document.createElement("li");
      infoElement.classList.add('listStyling');
      infoElement.innerHTML = `${prompt} - ${value}`;
      el.recipeAbout.append(infoElement);
    }
    for (ingredient of recipe.recipe_ingredients){
      const recipeIngredient = document.createElement("li");
      recipeIngredient.classList.add('listStyling', 'ingredientElem');
      recipeIngredient.innerHTML = ingredient;
      el.recipeIngredients.append(recipeIngredient);
    }
    for (steps of recipe.recipe_method){
      const recipeMethod = document.createElement("li");
      recipeMethod.classList.add('listStyling', 'methodElem');
      recipeMethod.innerHTML = steps;
      el.recipeMethod.append(recipeMethod);
    }
  } else {
    window.location.href = '/';
  }
}


/**
 * socialHandler - Adds event listener to the print button to trigger the window
 * print function. Also sets the schedule time for a recipe to now and sets the
 * facebook sharer link to one containing the id as a paramater. If reached this
 * link will load the shared recipes
 *
 */
function socialHandler(){
  el.print.addEventListener('click', () => window.print());
  el.dateControl.valueAsNumber = new Date().getTime();
  el.facebookShare.href = `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}?id=${recipe.recipe_id}`;
}


/**
 * checkURL - Collects the chosen recipe from local storage. If the url contains
 * an id parameter, this id is used to load that recipe instead.
 *
 * @return {*}  Will return an {object} if a recipe is found, otherwise {null}
 */
async function checkURL() {
  let retval = (window.localStorage.getItem('chosenRecipe') != null)
    ? JSON.parse(window.localStorage.getItem('chosenRecipe')) : null;
  try {
    if (window.location.href.includes('?id=')) {
      const id = window.location.href.replace(/.*\?id=/, '');
      try {
        retval = await getRecipe(id);
      } catch(err) {
        retval = null;
      }
    }
  } catch(err) {
    console.log(err);
  }

  return retval;
}


/**
 * scheduleHandler - This will take the datetime input value and attempt to
 * register the current recipe at that time. The request is invalid if the datetime
 * selected is in the past or if the server response 409 to say this schedule has
 * already been made
 *
 * A pop up message is displayed on the document to either confirm success or failure
 */
async function scheduleHandler() {
  try {
    const token = window.localStorage.getItem('jwt');
    if(!token) throw new Error('Please login to schedule a recipe');
    if(el.dateControl.valueAsNumber < Date.now()) throw new Error('Cannot schedule recipe in the past');
    const data = {recipe_id: recipe.recipe_id, scheduled_time: el.dateControl.value};
    await scheduleRecipe(data, token);
    el.scheduleMessage.textContent = 'Recipe scheduled';
  } catch(err) {
    el.scheduleMessage.textContent = err.message;
  }
  el.scheduleMessage.classList.remove('hiddenContent');
}

/**
 * pageLoaded - This function is triggered when the page loads to prepare the
 * necessary data and HTMLelements
 *
 */
async function pageLoaded() {
  prepareHandles();
  recipe = await checkURL();
  loadRecipe(recipe);
  if (recipe) {
    el.schedule.addEventListener('click', scheduleHandler);
    socialHandler();
  }
}

window.addEventListener('load', pageLoaded);


if(typeof module === 'object') {
  module.exports = {el, loadRecipe, pageLoaded};
}
