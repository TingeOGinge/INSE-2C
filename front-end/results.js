// window.localstorage.getitem
//
//
// json.parse.object

const el = {};

function prepareHandles() {
  el.recipeTitle = document.querySelector('#recipePlaceholder');
}

function loadRecipes(){
  if (window.localStorage.getItem('searchResult') != null){
    const recipes = JSON.parse(window.localStorage.getItem('searchResult'));

    let recipe = "";
    let ingredient = "";

    for (recipe of recipes){
      const recipeContainer = document.createElement("div");
      recipeContainer.id = 'recipe';
      el.recipeTitle.append(recipeContainer);

      const recipeHeader = document.createElement("h3");
      recipeHeader.id = 'recipeTitle';
      recipeHeader.innerHTML = recipe.recipe_name;
      el.recipeTitle.append(recipeHeader);

      const recipeIngredients = document.createElement("ul");
      recipeIngredients.id = 'recipeIngredient';
      el.recipeTitle.append(recipeIngredients);

      for (ingredient of recipe.recipe_ingredients){
        const recipeIngredient = document.createElement("li");
        recipeIngredient.innerHTML = ingredient;
        el.recipeTitle.append(recipeIngredient);
      }
    }
}
}

function addEventListeners() {
}

function pageLoaded() {
  prepareHandles();
  addEventListeners();
  loadRecipes();
}

window.addEventListener('load', pageLoaded);
