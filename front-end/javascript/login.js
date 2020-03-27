/* global login, module */

const el = {};

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

function checkKeys(e) {
  if (e.key === 'Enter') loginUser();
}

function prepareHandles() {
  el.username = document.querySelector('#loginUsername');
  el.password = document.querySelector('#loginPassword');
  el.registerButton = document.querySelector('#loginButton');
  el.loginPopup = document.querySelector('#loginPopup');
}

function addEventListeners() {
  el.registerButton.addEventListener('click', loginUser);
  el.password.addEventListener('keyup', checkKeys);
}

function init() {
  prepareHandles();
  addEventListeners();
}

window.addEventListener('load', init);

if (typeof module === 'object') module.exports = {el, loginUser};
