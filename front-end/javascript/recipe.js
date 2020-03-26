/* global getRecipe, scheduleRecipe */

const el = {};
let recipe;

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

function loadRecipe(recipe){
  window.console.log(recipe)

  if (recipe != null){
    let ingredient;
    let steps;
    el.recipeTitle.append(recipe.recipe_name);

    for (ingredient of recipe.recipe_ingredients){
      const recipeIngredient = document.createElement("li");
      recipeIngredient.classList.add('listStyling');
      recipeIngredient.innerHTML = ingredient;
      el.recipeIngredients.append(recipeIngredient);
    }
    for (steps of recipe.recipe_method){
      const recipeMethod = document.createElement("li");
      recipeMethod.classList.add('listStyling');
      recipeMethod.innerHTML = steps;
      el.recipeMethod.append(recipeMethod);
    }
  } else {
    window.location.href = '/';
  }
}

function socialHandler(){
  el.print.addEventListener('click', () => window.print());
  el.dateControl.valueAsNumber = new Date().getTime();
  el.facebookShare.href = `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}?id=${recipe.recipe_id}`;
}

async function checkURL() {
  let retval = (window.localStorage.getItem('chosenRecipe') != null)
    ? JSON.parse(window.localStorage.getItem('chosenRecipe')) : null;
  if (window.location.href.includes('?id=')) {
    const id = window.location.href.replace(/.*\?id=/, '');
    try {
      retval = await getRecipe(id);
    } catch(err) {
      retval = null;
    }
  }
  return retval;
}

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

async function pageLoaded() {
  prepareHandles();
  recipe = await checkURL();
  loadRecipe(recipe);
  el.schedule.addEventListener('click', scheduleHandler);
  socialHandler();
}

window.addEventListener('load', pageLoaded);
