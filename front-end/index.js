/* global module, clientSideAPI */

const el = {
  ingredientArray: [],
  chosenRestrictions: []
};

/* adds ingredients to list below  */
function addIngredienttoLI() {
  const listItem = document.createElement("li");
  listItem.classList.add('parameter');
  listItem.addEventListener('click', removeParameterHandler);
  let query = document.getElementById("searchbar").value;
  listItem.textContent = query;
  el.ingredientList.append(listItem);
  el.ingredientArray.push(query);
  removeContentFrom(el.searchBar);
}

function removeParameterHandler(e) {
  if (el.ingredientArray.indexOf(e.target.textContent) !== -1) {
    el.ingredientArray.splice(e.target.textContent, 1);
  }
  e.target.remove();
}

function collectSearchObject() {
  const searchObj = {parameters: el.ingredientArray};

  if (el.time.value !== '' && Number.isInteger(el.time.value)) {
    searchObj.time = Number(el.time.value);
  }
  if (el.cal.value !== '' && Number.isInteger(el.cal.value)) {
    searchObj.calories = Number(el.cal.value);
  }
  if (el.serve.value !== '' && Number.isInteger(el.serve.value)) {
    searchObj.serving = Number(el.serve.value);
  }
  for (const restriction of el.restrictions) {
    if (restriction.checked) {
      el.chosenRestrictions.push(restriction);
    }
  }
  el.restrictions.forEach(elem => {
    if (elem.checked) el.chosenRestrictions.push(elem);
  });

  return searchObj;
}


/* handles what is done when the search button is pressed */

async function searchHandler(){
  if (el.ingredientArray.length > 0) {
    try{
      const searchObj = collectSearchObject();
      const searchResult = await clientSideAPI.search(searchObj);
      window.localStorage.setItem('searchResult', JSON.stringify(searchResult));
      window.location.href = 'results.html';
    } catch (err) {
      // handle search with no response
      console.log(err);
    }
  }
}

/* handles all elements and stores them in 'el' class */
function prepareHandles() {
  el.ingredientButton = document.querySelector('#addIngredient');
  el.searchBar = document.querySelector('#searchbar');
  el.searchButton = document.querySelector('#search');
  el.ingredientList = document.querySelector('#ingredient');
  el.time = document.querySelector('#time');
  el.cal = document.querySelector('#cal');
  el.serve = document.querySelector('#serve');
  el.restrictions = document.querySelectorAll('.restriction');
}

/* listens on all events */
function addEventListeners() {
  el.ingredientButton.addEventListener('click', addIngredienttoLI);
  // el.ingredientToRemove.addEventListener('click', removeIngredientFromArray);
  el.searchButton.addEventListener('click', searchHandler);
  el.searchBar.addEventListener('keyup', checkKeys);
}

/* remove all content from searchbar */
function removeContentFrom(what) {
  what.value = '';
}

/* allows return key to be used to add ingredients */
function checkKeys(e) {
  if (e.key === 'Enter') {
    addIngredienttoLI();
  }
}

function pageLoaded() {
  prepareHandles();
  addEventListeners();
}


// Needed for testing purposes
const indexAPI = {el, searchHandler};

if (typeof module === 'object') {
  module.exports = indexAPI;
}

window.addEventListener('load', pageLoaded);
