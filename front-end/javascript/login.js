/* global login, module */

/**
 * @module User Login Page
 */

/**
 * @const elementObject
 */
const el = {};


/**
 * loginUser - Allows user to login. Username and password from input boxes are
 * stored in loginOBJ and passed to the login function which returns a Javascript
 * Web Token if the username and password are present in the database.
 * The JWT is stored in localStorage and used throughout the application to validate
 * the session and the user.
 * Redirects user to homepage.
 *
 * @return {boolean}  catch error returns a false for testing
 */
async function loginUser() {
  if (el.username.value !== "" && el.password.value !== "") {
    try {
      const loginObj = {username: el.username.value, password: el.password.value};
      const jwt = await login(loginObj);
      window.localStorage.setItem('jwt', jwt);
      window.location.href = 'index.html';
    } catch(err) {
      // Either 409 Conflict, 400 Bad Request or 500 Internal Server Error if unforseen issue
      el.loginPopup.textContent = (err.message === 'Forbidden') ? 'Incorrect Password' : err.message;
      el.loginPopup.classList.remove('hiddenContent');
      return false;
    }
  }
}

/**
 * checkKeys - allows return key to be used to add ingredients to list
 *
 * @param  {HTMLElement} e event
 */
function checkKeys(e) {
  if (e.key === 'Enter') loginUser();
}
/**
 * prepareHandles - Selects elements from the document to be used later on by
 * storing in the global element (el) class
 *
 */
function prepareHandles() {
  el.username = document.querySelector('#loginUsername');
  el.password = document.querySelector('#loginPassword');
  el.registerButton = document.querySelector('#loginButton');
  el.loginPopup = document.querySelector('#loginPopup');
}

/**
 * addEventListeners - Adds event listeners where needed
 */
function addEventListeners() {
  el.registerButton.addEventListener('click', loginUser);
  el.password.addEventListener('keyup', checkKeys);
}

/**
 * pageLoaded - Runs when the page is loaded - similar to a Java main function
 */
function pageLoaded() {
  prepareHandles();
  addEventListeners();
}

window.addEventListener('load', pageLoaded);

if (typeof module === 'object') module.exports = {el, loginUser};
