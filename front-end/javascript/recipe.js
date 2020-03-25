const el = {};
const recipes = (window.localStorage.getItem('chosenRecipe') != null)
  ? JSON.parse(window.localStorage.getItem('chosenRecipe')) : null;


function prepareHandles() {
  el.recipeTitle = document.querySelector('#detail');
  el.recipeIngredients = document.querySelector('#ingredients');
  el.recipeMethod = document.querySelector('#method');
}

function loadRecipe(){
  if (recipes != null){
    let ingredient;
    let steps;
    el.recipeTitle.append(recipes.recipe_name);

    for (ingredient of recipes.recipe_ingredients){
      const recipeIngredient = document.createElement("li");
      recipeIngredient.classList.add('listStyling');
      recipeIngredient.innerHTML = ingredient;
      el.recipeIngredients.append(recipeIngredient);
    }
    for (steps of recipes.recipe_method){
      const recipeMethod = document.createElement("li");
      recipeMethod.classList.add('listStyling');
      recipeMethod.innerHTML = steps;
      el.recipeMethod.append(recipeMethod);
    }
  }
}

function pageLoaded() {
  prepareHandles();
  loadRecipe();
}

window.addEventListener('load', pageLoaded);
