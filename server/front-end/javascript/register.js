/* global registerUser, module */

/**
 * @module User Register Page
 */

const el = {};

/**
 * prepareHandles - Selects elements from the document to be used later on by
 * storing in the global element (el) class
 *
 */
function prepareHandles() {
  el.username = document.querySelector('#username');
  el.password = document.querySelector('#password');
  el.registerButton = document.querySelector('#registerButton');
  el.registerPopup = document.querySelector('#registerPopup');
}


/**
 * register - Allows user to register. Username and password from input boxes are
 * stored in registerOBJ and passed to the global registerUser function and the
 * user is redirected to the login page to use their newly created credentials.
 * Should an error occur, the user is presented with an error message depending
 * on the response from the server.
 * Either 409 Conflict, 400 Bad Request or 500 Internal Server Error if unforseen issue
 *
 * @return {boolean}  catch error returns a false for testing purposes
 */
async function register() {
  if (el.username.value !== "" && el.password.value !== "") {
    try {
      const registerObj = {username: el.username.value, password: el.password.value};
      await registerUser(registerObj);
      window.location.href = 'login.html';
    } catch(err) {
      // Either 409 Conflict, 400 Bad Request or 500 Internal Server Error if unforseen issue
      el.registerPopup.textContent = err.message;
      el.registerPopup.classList.remove('hiddenContent');
      return false;
    }
  }
}

/**
 * checkKeys - allows return key to be used to add ingredients to list
 * @param  {HTMLElement} e event
 */
function checkKeys(e) {
  if (e.key === 'Enter') register();
}

/**
 * addEventListeners - Adds event listeners where needed
 */
function addEventListeners() {
  el.registerButton.addEventListener('click', register);
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

if (typeof module === 'object') module.exports = {el, register};
