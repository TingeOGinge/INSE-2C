/* global module, search */

// Object that holds all the document's elements that we want
// Probably not worth documenting as it's just a general practice but no harm if it is
const el = {
  ingredientArray: [],
  chosenRestrictions: []
};

/* adds ingredients to list below  */
// attached to event listener when someone presses 'Add Ingredient' or presses enter in the search bar
// Creates a list element
// Adds the 'parameter' class to the element
// Adds an event listener so if it's clicked it will be removed
// Content of the list item is the value in the search bars
// It's pushed to the el.ingredientArray for use later
// Search bar is cleared
// <li> is added to <ul> on html page
function addIngredienttoLI() {
  const listItem = document.createElement("li");
  const pElem = document.createElement("p");
  const removeItemBtn = document.createElement("button");

  let query = document.getElementById("searchbar").value;
  listItem.classList.add('parameter','addIngredientList', `param-${query}`);
  pElem.textContent = query;

  removeItemBtn.textContent = "X";
  removeItemBtn.classList.add('addIngredientList', `param-${query}`, 'paramButton');
  removeItemBtn.addEventListener('click', removeParameterHandler);
  listItem.append(pElem);
  listItem.append(removeItemBtn);


  el.ingredientList.append(listItem);
  el.ingredientArray.push(query);
  removeContentFrom(el.searchBar);
}

function removeParameterHandler(e) {
  // if (el.ingredientArray.indexOf(e.target.textContent) !== -1) {
  //   el.ingredientArray.splice(e.target.textContent, 1);
  // }
  // console.log(e.target.textContent);
  let removeClass;
  e.target.classList.forEach(elem => {
    if(elem.includes('param-')) removeClass = `.${elem}`;
  });
  document.querySelectorAll(removeClass).forEach(elem => {
    if(elem.tagName === 'LI') {
      const index = el.ingredientArray.indexOf(elem.textContent.replace('X', ''));
      el.ingredientArray.splice(index, 1);
    }
    elem.remove();
  });
}

// Trawl through all necessary elements in the page
// Checks value in element is present and of a valid format (i.e., a number)
// Converts string number to actual integer where needed
// Returns false if input is invalid anywhere
// Returns search object if all is well
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
    if (elem.checked) el.chosenRestrictions.push(elem.name);
  });
  searchObj.restrictions = el.chosenRestrictions;

  return searchObj;
}


/* handles what is done when the search button is pressed */

// Function triggered when user clicks search button
// Collects search object in function above
// If search object is not valid it throws an error
// Otherwise the query is made to the database
// If database throws an error it will be caught
// Otherwise the search result is stored in local storage
// User is then redirected to the results page
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
      el.popupContent.textContent = err.message;
      el.popupContainer.classList.remove('hiddenContent');
    }
  }
}

function uncheckRestriction(e) {
  if(el.chosenRestrictions.includes(e.target.name)) {
    el.chosenRestrictions.splice(el.chosenRestrictions.indexOf(e.target.name),1);
  }
}

/* handles all elements and stores them in 'el' class */
// Selects elements from the document to be used later on
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
// Adds event listeners where needed
function addEventListeners() {
  el.ingredientButton.addEventListener('click', addIngredienttoLI);
  el.searchButton.addEventListener('click', searchHandler);
  el.searchBar.addEventListener('keyup', checkKeys);
  el.popupButton.addEventListener('click', popupButtonHandler);
  el.restrictions.forEach(e => e.addEventListener('click', uncheckRestriction));
}

// Pop us is generated when search object is invalid
// This function is fired when user closes that pop up
// Rehides the pop up and removes the old error message
function popupButtonHandler(){
  el.popupContainer.classList.add('hiddenContent','errorPopup');
  el.popupContent.textContent = '';
}

/* remove all content from searchbar */
// Used to remove the content from the search bar
function removeContentFrom(what) {
  what.value = '';
}

/* allows return key to be used to add ingredients */
function checkKeys(e) {
  if (e.key === 'Enter') {
    addIngredienttoLI();
  }
}

// Runs when the page is loaded - similar to a Java main function
function pageLoaded() {
  prepareHandles();
  addEventListeners();
  window.localStorage.removeItem('searchResult');
}

window.addEventListener('load', pageLoaded);



// Everything below is needed for testing purposes and doesn't need documenting
const indexAPI = {el, searchHandler};

if (typeof module === 'object') {
  module.exports = indexAPI;
}
