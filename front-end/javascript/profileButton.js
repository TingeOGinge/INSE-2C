const el = {
  profileButton: document.querySelector('#btnProfile')
};

window.addEventListener('load', init);

function init() {
  const flag = window.localStorage.getItem('jwt') == null;
  el.profileButton.href = (flag) ? '#' : 'profile.html';
  el.profileButton.classList.toggle('class', flag);
}
