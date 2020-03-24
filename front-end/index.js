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
  const searchObj = {
    parameters: el.ingredientArray,
    valid: true
  };

  if (el.time.value !== '') {
    if (!isNaN(parseInt(el.time, 10))) {
      searchObj.time = parseInt(el.time, 10);
    } else {
      searchObj.valid = false;
      return searchObj;
    }
  }
  if (el.cal.value !== '') {
    if (!isNaN(parseInt(el.cal, 10))) {
      searchObj.calories = Number.parseInt(el.cal);
    } else {
      searchObj.valid = false;
      return searchObj;
    }
  }
  if (el.serve.value !== '') {
    if (!isNaN(parseInt(el.serve, 10))) {
      searchObj.serving = Number.parseInt(el.serve);
    } else {
      searchObj.valid = false;
      return searchObj;
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
      if (!searchObj.valid) throw new Error("It seems you've entered invalid search paramters");
      const searchResult = await clientSideAPI.search(searchObj);
      window.localStorage.setItem('searchResult', JSON.stringify(searchResult));
      window.location.href = 'results.html';
    } catch (err) {
      // handle search with no response
      console.log(err);
      el.popupContent.textContent = err;
      el.popupContainer.classList.remove('hiddenContent');
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
  el.popupContainer = document.querySelector('#searchErrorPopup');
  el.popupContent= document.querySelector('#searchErrorContent');
  el.popupButton = document.querySelector('#searchPopupButton');
}

/* listens on all events */
function addEventListeners() {
  el.ingredientButton.addEventListener('click', addIngredienttoLI);
  el.searchButton.addEventListener('click', searchHandler);
  el.searchBar.addEventListener('keyup', checkKeys);
  el.popupButton.addEventListener('click', popupButtonHandler);
}

function popupButtonHandler(){
  el.popupContainer.classList.add('hiddenContent');
  el.popupContent.textContent = '';
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
