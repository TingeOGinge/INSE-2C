/* Global api */

const el = {
  ingredientArray: []
};

/* adds ingredients to list below  */
function addIngredienttoLI() {
  const listItem = document.createElement("li");
  let query = document.getElementById("searchbar").value;
  listItem.textContent = query;
  el.ingredientList.append(listItem);
  el.ingredientArray.push(query);
  removeContentFrom(el.searchBar);
  window.console.log(el.ingredientArray);
}

// function removeIngredientFromArray(){
// }

// function requirementsHandler(options){
//
// }


/* handles what is done when the search button is pressed */

// async function searchHandler(){
//   if (el.ingredientArray.length > 0) {
//     try{
//       const response = await api.search(el.ingredientArray);
//       const searchResult = response.json();
//     } catch (response) {
//       if (response.statusCode === 404) {
//
//       } else if (response.statusCode === 500) {
//
//       }
//     }
//   }
// }

/* handles all elements and stores them in 'el' class */
function prepareHandles() {
  el.ingredientButton = document.querySelector('#addIngredient');
  el.searchBar = document.querySelector('#searchbar');
  el.searchButton = document.querySelector('#search');
  el.ingredientList = document.querySelector('#ingredient');
  // el.ingredientToRemove = document.querySelector('#ingredient');

  el.disptime = document.querySelector('#disptime');
  el.dispcal = document.querySelector('#dispcal');
  el.dispserve = document.querySelector('#dispserve');
}

/* listens on all events */
function addEventListeners() {
  el.ingredientButton.addEventListener('click', addIngredienttoLI);
  // el.ingredientToRemove.addEventListener('click', removeIngredientFromArray);
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
