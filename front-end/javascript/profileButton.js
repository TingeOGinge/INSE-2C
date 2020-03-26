const elem = {
  profileButton: document.querySelector('#btnProfile'),
  loginButton: document.querySelector('#btnWhite'),
  registerButton: document.querySelector('#btnBlue')
};

window.addEventListener('load', init);

function init() {
  if (window.localStorage.getItem('jwt') == null) {
    elem.profileButton.href = '#';
    elem.loginButton.href = 'login.html';
    elem.registerButton = 'register.html';
  } else {
    elem.profileButton.href = 'profile.html';
    elem.loginButton.href = '#';
    elem.registerButton.href = '#';
    console.log(elem.registerButton);
  }


}
