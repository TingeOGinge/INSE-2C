const elem = {
  profileButton: document.querySelector('#btnProfile'),
  loginButton: document.querySelector('#btnWhite'),
  registerButton: document.querySelector('#btnBlue')
};

window.addEventListener('load', init);

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

function logout() {
  window.localStorage.removeItem('jwt');
  location.reload();
}
