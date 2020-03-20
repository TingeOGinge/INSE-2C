const el = {};

/* adds ingredients to list below  */
function addIngredienttoLI() {
  const listItem = document.createElement("li");
  let query = document.getElementById("searchbar").value;
  listItem.textContent = query;
  el.ingredientList.append(listItem);
  removeContentFrom(el.searchBar);
  window.console.log(el.ingredientList.textContent);
}

/* adds all ingredients entered in searchbar to list */

// function ingredientListtoArray(messages, where) {
//   el.ingredientList.
//   for (const message of messages) {
//     const li = document.createElement('li');
//     li.textContent = message;
//     where.append(li);
//   }
// }

/* handles what is done when the search button is pressed */

// function searchHandler(){
//     if (ingredientList != null){
//       return ingredientList;
//     }
//     else{
//       return el.searchBar.value;
//     }
// }

/* handles all elements and stores them in 'el' class */
function prepareHandles() {
  el.ingredientButton = document.querySelector('#addIngredient');
  el.searchBar = document.querySelector('#searchbar');
  el.searchButton = document.querySelector('#search');
  el.ingredientList = document.querySelector('#ingredient');
}

/* listens on all events */
function addEventListeners() {
  el.ingredientButton.addEventListener('click', addIngredienttoLI);
  // el.searchButton.addEventListener('click', searchHandler);
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

window.addEventListener('load', pageLoaded);
