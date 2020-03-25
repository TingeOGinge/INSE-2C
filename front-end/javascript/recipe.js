/* global getRecipe, scheduleRecipe, FB */

const el = {};
let recipe;

function prepareHandles() {
  el.recipeTitle = document.querySelector('#detail');
  el.recipeIngredients = document.querySelector('#ingredients');
  el.recipeMethod = document.querySelector('#method');
  el.dateControl = document.querySelector('input[type="datetime-local"]');
  el.print = document.querySelector('#printButton');
  el.schedule = document.querySelector('#scheduleButton');
  el.share = document.querySelector('#shareButton');
}

function loadRecipe(recipe){
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
  el.share.href = `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}?id=${recipe.recipe_id}`;

  // el.share.onclick = () => {
  //   FB.ui({
  //     method: 'share',
  //     href: `${window.location.href}?id=${recipe.recipe_id}`,
  //   }, function(response){});
  // };
}

  //
  // el.share.setAttribute('data-href', `${window.location.href}?id=${recipe.recipe_id}`);
  // console.log(el.share['data-href']);








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
    const data = {recipe_id: recipe.recipe_id, scheduled_time: el.dateControl.value};
    await scheduleRecipe(data, token);
    console.log('Success');
  } catch(err) {
    console.log(err);
  }
}

async function pageLoaded() {
  prepareHandles();
  recipe = await checkURL();
  loadRecipe(recipe);
  el.schedule.addEventListener('click', scheduleHandler);
  socialHandler();
}

window.addEventListener('load', pageLoaded);
