const elem = {
  profileButton: document.querySelector('#btnProfile')
};

window.addEventListener('load', init);

function init() {
  const flag = window.localStorage.getItem('jwt') == null;
  elem.profileButton.href = (flag) ? '#' : 'profile.html';
  elem.profileButton.classList.toggle('class', flag);
}
