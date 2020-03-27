const register = require('../front-end/javascript/register.js');
const path = require('path');
const fs = require('fs');

const HTML_TEMPLATE = fs.readFileSync(path.join(__dirname, '..', 'front-end', 'register.html'));
const LOAD_EVENT = new Event('load');

function resetWindowLocation() {
  window.location.href = 'register.html';
}

describe("Test front-end/register.js", () => {

  beforeEach(() => {
    fetch.resetMocks();
    document.body.innerHTML = HTML_TEMPLATE;
    resetWindowLocation();
    dispatchEvent(LOAD_EVENT);
  });

  const mockRegister = jest.fn(register.register);

  test("Test valid registering of a user", async () => {
    try {
      fetch.mockResponse('', { status: 201 });

      register.el.username.value = 'username';
      register.el.password.value = 'password';
      await mockRegister();
      expect(window.location.href).toEqual('login.html');
    } catch(err) {
      console.log(err);
    }
  });

  test("Test duplicate registering of a user", async () => {
    try {
      fetch.mockResponse('', { status: 409 });

      register.el.username.value = 'username';
      register.el.password.value = 'password';
      expect(await mockRegister()).toBe(false);
      expect(window.location.href).toEqual('register.html');
      expect(register.el.registerPopup.textContent).toBe('Conflict');
    } catch(err) {
      console.log(err);
    }
  });

  test("Test registering of a user with bad request body", async () => {
    try {
      fetch.mockResponse('', { status: 400 });

      register.el.username.value = ' ';
      register.el.password.value = ' ';
      expect(await mockRegister()).toBe(false);
      expect(window.location.href).toEqual('register.html');
      expect(register.el.registerPopup.textContent).toBe('Bad Request');
    } catch(err) {
      console.log(err);
    }
  });

});
