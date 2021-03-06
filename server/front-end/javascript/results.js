/* global module */


/**
 * @module Search Results Page
 */

/**
 * @const {object} - Initialises element object used for globally storing HTML elements
 */
const el = {};

/**
 * prepareHandles - Selects elements from the document to be used later on by
 * storing in the global element (el) class
 *
 */
function prepareHandles() {
  el.recipeTitle = document.querySelector('#recipePlaceholder');
  el.recipes = (window.localStorage.getItem('searchResult') != null)
    ? JSON.parse(window.localStorage.getItem('searchResult')) : null;
}

/**
 * loadRecipes - takes the global recipes array with the search results to populate the recipe
 * page. Loops through array of recipe search results and creates the follow HTML elements
 * (-div [recipe container]
 * -h3 [recipe title]
 * -h4 [ingredients header]
 * -ul [ingredient list]
 * -li) [ingredient]
 * These are given a class name based on their recipe_id which allows the recipes to dynamically
 * be created, styled and addressed.
 * The ingredients are added to the list by iterating through the recipe_ingredients array
 * The eventListener is attached to every recipe to allow clicking on each recipe by passing to
 * the linkHandler function.
 * If no results are populated in to el.recipes from localStorage then user is redirected to
 * root(index.html).
 *
 */
function loadRecipes(){
  if (el.recipes != null){

    let recipe;
    let ingredient;

    for (recipe of el.recipes){

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

      for (ingredient of recipe.recipe_ingredients){
        const recipeIngredient = document.createElement("li");
        recipeIngredient.innerHTML = ingredient;
        recipeIngredient.classList.add(
          'ingredientList',
          'recipeEventListener',
          recipeIDClass
        );
        recipeContainer.append(recipeIngredient);
      }
    }
    document.querySelectorAll('.recipeEventListener').forEach(elem => {
      elem.addEventListener('click', linkHandler);
    });
  } else {
    window.location.href = '/';
  }
}


/**
 * linkHandler - Takes the clicked element and using its class name that has its
 * recipeID, it finds this recipe and stores in chosenRecipe which is moved to
 * localStorage. The user is then redirected to the recipe page.
 *
 * @param  {HTMLElement} e element
 * @property {object} chosenRecipe all information about recipe from database
 */
function linkHandler(e){
  const elementClassList = e.target.classList;
  let recipeID;
  elementClassList.forEach(elementClass => {
    if (elementClass.includes('recipeID')) {
      recipeID = elementClass.replace('recipeID', '');
    }
  });
  recipeID = parseInt(recipeID, 10);
  const chosenRecipe = el.recipes.find(recipe => recipe.recipe_id === recipeID);
  window.localStorage.setItem('chosenRecipe', JSON.stringify(chosenRecipe));
  window.location.href = 'recipe.html';
}

/**
 * pageLoaded - Runs when the page is loaded - similar to a Java main function
 */
function pageLoaded() {
  prepareHandles();
  loadRecipes();
}

window.addEventListener('load', pageLoaded);


if (typeof module === 'object') {
  module.exports = {el, pageLoaded};
}
