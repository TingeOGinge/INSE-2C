/* global module, search */


/**
 * @module Homepage and Search Page
 */

/**
 * @const {object}
 * @property {string[]} ingredientArray - Contains search parameters for user
 * @property {string[]} chosenRestrictions - Contains restrictions with which we filter the results
 */
const el = {
  ingredientArray: [],
  chosenRestrictions: []
};


/**
 * addIngredienttoLI - populates ingredients searched for by the user in to list
 * elements whilst appending to this to an array and placing a remove button and
 * 'remove' button next to each list element that allows the user to remove items
 * from the list. The removeContentFrom() function is called to remove text from
 * the searchbar.
 *
 * @property {HTMLElement}  listItem - list tag element
 * @property {HTMLElement}  pElem - p tag element
 * @property {HTMLElement}  removeItemBtn - button tag element
 * @property {HTMLElement}  query - text inside searchbar
 *
 */

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

/**
 * removeParameterHandler - finds ingredient in list of elements by using a regex
 * statement to check the ingredient in class name against the ingredient in element
 * name to be removed, this enables the ingredient to be addressed and removed from the
 * ingredientArray.
 *
 * @param  {Event} e element event property
 * @property {String} removeClass name of ingredient to be removed
 */
function removeParameterHandler(e) {
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

/**
 * collectSearchObject - Trawl through all necessary elements in the page
 * Checks value in element is present and of a valid format (i.e., a number)
 * Converts string number to actual integer where needed
 *
 * @return {Boolean} Returns false if input is invalid anywhere
 * @return {Object} Returns search object if all is well
 */
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

/**
 * searchHandler - Function triggered when user clicks search button
 * Collects search object in function above
 * If search object is not valid it throws an error
 * Otherwise the query is made to the database
 * If database throws an error it will be caught
 * Otherwise the search result is stored in local storage
 * User is then redirected to the results page
 *
 */
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


/**
 * uncheckRestriction - Ensures if dietary restriction is not checked that it is
 * removed from the restriction array
 *
 * @param  {HTMLElement} e event
 */
function uncheckRestriction(e) {
  if(el.chosenRestrictions.includes(e.target.name)) {
    el.chosenRestrictions.splice(el.chosenRestrictions.indexOf(e.target.name),1);
  }
}

/**
 * prepareHandles - Selects elements from the document to be used later on by
 * storing in the global element (el) class
 *
 */
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

/**
 * addEventListeners - Adds event listeners where needed
 */
function addEventListeners() {
  el.ingredientButton.addEventListener('click', addIngredienttoLI);
  el.searchButton.addEventListener('click', searchHandler);
  el.searchBar.addEventListener('keyup', checkKeys);
  el.popupButton.addEventListener('click', popupButtonHandler);
  el.restrictions.forEach(e => e.addEventListener('click', uncheckRestriction));
}

/**
 * popupButtonHandler - Pop us is generated when search object is invalid
 * This function is fired when user closes that pop up
 * Rehides the pop up and removes the old error message
 */
function popupButtonHandler(){
  el.popupContainer.classList.add('hiddenContent','errorPopup');
  el.popupContent.textContent = '';
}

/**
 * removeContentFrom - Used to remove the content from the search bar
 *
 * @param  {HTMLElement} what Object holding the searchbar element
 */
function removeContentFrom(what) {
  what.value = '';
}

/**
 * checkKeys - allows return key to be used to add ingredients to list
 *
 * @param  {HTMLElement} e event
 */
function checkKeys(e) {
  if (e.key === 'Enter') {
    addIngredienttoLI();
  }
}

/**
 * pageLoaded - Runs when the page is loaded - similar to a Java main function
 */
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
