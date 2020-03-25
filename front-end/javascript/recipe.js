/* global getRecipe */

const el = {};

function prepareHandles() {
  el.recipeTitle = document.querySelector('#detail');
  el.recipeIngredients = document.querySelector('#ingredients');
  el.recipeMethod = document.querySelector('#method');
  el.dateControl = document.querySelector('input[type="datetime-local"]');
  el.print = document.querySelector('#print');
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

function socialControl(){
  el.print.addEventListener('click', () => window.print());
  el.dateControl.valueAsNumber = new Date().getTime();
}

async function checkURL() {
  let recipe = (window.localStorage.getItem('chosenRecipe') != null)
    ? JSON.parse(window.localStorage.getItem('chosenRecipe')) : null;
  if (window.location.href.includes('?id=')) {
    const id = window.location.href.replace(/.*\?id=/, '');
    try {
      recipe = await getRecipe(id);
    } catch(err) {
      recipe = null;
      console.log(err);
    }
  }
  return recipe;
}

async function pageLoaded() {
  prepareHandles();
  const recipe = await checkURL();
  loadRecipe(recipe);
  socialControl();
}

window.addEventListener('load', pageLoaded);
