
/**
 * @module Buttons
 */

const elem = {
  profileButton: document.querySelector('#btnProfile'),
  loginButton: document.querySelector('#btnWhite'),
  registerButton: document.querySelector('#btnBlue')
};

window.addEventListener('load', init);


/**
 * init - Initialises the profile/register/login buttons
 *
 * If a JWT is present: deactive the register button, convert the Login button to
 * a Logout button and activate the profile button
 *
 * If no JWT present: deactivate the profile button. Register and login are active by default
 *
 * @return {type}  description
 */
function init() {
  if (window.localStorage.getItem('jwt') == null) {
    elem.profileButton.href = '#';
    elem.profileButton.classList.add('greyOutImage');

    elem.loginButton.href = 'login.html';

    elem.registerButton = 'register.html';
  } else {
    elem.profileButton.href = 'profile.html';
    elem.profileButton.classList.remove('greyOutImage');

    elem.loginButton.href = '#';
    elem.loginButton.textContent = 'Logout';
    elem.loginButton.addEventListener('click', logout);

    elem.registerButton.href = '#';
    elem.registerButton.classList.add('greyOutImage');
  }

}


/**
 * logout - Delete JWT from localStorage and refresh the page
 *
 * @return {type}  description
 */
function logout() {
  window.localStorage.removeItem('jwt');
  location.reload();
}
