/* global module, search */

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

  if (el.time.value !== ''){
    if (isNaN(el.time.value)) {
      searchObj.valid = false;
      return searchObj;
    }
    searchObj.time = parseInt(el.time.value, 10);
  }

  if (el.cal.value !== ''){
    if (isNaN(el.cal.value)) {
      searchObj.valid = false;
      return searchObj;
    }
    searchObj.calories = parseInt(el.cal.value, 10);
  }

  if (el.serve.value !== ''){
    if (isNaN(el.serve.value)) {
      searchObj.valid = false;
      return searchObj;
    }
    searchObj.serving = parseInt(el.serve.value, 10);
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
      const searchResult = await search(searchObj);
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
  // add profile btn
}

// pflistener
// if (window.localStorage.getitem('jwt') =! null){
//
// }

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
  window.localStorage.removeItem('searchResult');
}


// Needed for testing purposes
const indexAPI = {el, searchHandler};

if (typeof module === 'object') {
  module.exports = indexAPI;
}

window.addEventListener('load', pageLoaded);
