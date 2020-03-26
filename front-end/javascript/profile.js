/* global getUserSchedule, deleteFromSchedule */

const el = {};
let recipes;

function loadRecipes() {
  for (const recipe of recipes){
    let recipeIDClass = `recipeID${recipe.recipe_id}`;
    const recipeContainer = document.createElement("div");
    recipeContainer.classList.add(
      'recipe',
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
  }
  document.querySelectorAll('.recipeEventListener').forEach(elem => {
    elem.addEventListener('click', linkHandler);
  });
}

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

function linkHandler(e){
  const chosenRecipe = getRecipeFromEvent(e);
  window.localStorage.setItem('chosenRecipe', JSON.stringify(chosenRecipe));
  window.location.href = 'recipe.html';
}

async function getSchedule() {
  const token = window.localStorage.getItem('jwt');
  try {
    if(!token) throw new Error('No JWT found');
    const schedule = await getUserSchedule(token);
    return schedule;
  } catch(err) {
    console.log(err);
  }
}

async function deleteRecipe(e) {
  const chosenRecipe = getRecipeFromEvent(e);
  const token = window.localStorage.getItem('jwt');
  try {
    if(!token) throw new Error('No JWT found');
    const data = {
      recipe_id: chosenRecipe.recipe_id,
      scheduled_time: chosenRecipe.scheduled_time
    };
    await deleteFromSchedule(data, token);
  } catch(err) {
    console.log(err);
  }
}

function prepareHandles() {
  el.recipeTitle = document.querySelector('#recipePlaceholder');
}

async function pageLoaded() {
  prepareHandles();
  recipes = await getSchedule();
  loadRecipes();
}

window.addEventListener('load', pageLoaded);
