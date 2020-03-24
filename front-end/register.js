/* global clientSideAPI, module */

const el = {};

function prepareHandles() {
  el.username = document.querySelector('#username');
  el.password = document.querySelector('#password');
  el.registerButton = document.querySelector('#registerButton');
}

async function register() {
  if (el.username.value !== "" && el.password.value !== "") {
    try {
      const registerObj = {username: el.username.value, password: el.password.value};
      await clientSideAPI.registerUser(registerObj);
      window.location.href = 'login.html';
    } catch(err) {
      // Either 409 Conflict, 400 Bad Request or 500 Internal Server Error if unforseen issue
      console.log(err);
      return false;
    }
  }
}

function checkKeys(e) {
  if (e.key === 'Enter') register();
}

function addEventListeners() {
  el.registerButton.addEventListener('click', register);
  el.password.addEventListener('keyup', checkKeys);
}

function init() {
  prepareHandles();
  addEventListeners();
}

window.addEventListener('load', init);

if (typeof module === 'object') module.exports = {el, register};
