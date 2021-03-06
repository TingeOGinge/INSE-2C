const loginScript = require('../front-end/javascript/login.js');
const path = require('path');
const fs = require('fs');

const HTML_TEMPLATE = fs.readFileSync(path.join(__dirname, '..', 'front-end', 'login.html'));
const LOAD_EVENT = new Event('load');

function resetWindowLocation() {
  window.location.href = 'login.html';
}

describe("Tetst front-end/login.js", () => {

  beforeEach(() => {
    fetch.resetMocks();
    document.body.innerHTML = HTML_TEMPLATE;
    resetWindowLocation();
    dispatchEvent(LOAD_EVENT);
  });

  const mockLoginUser = jest.fn(loginScript.loginUser);

  test("Test valid logging in of a user", async () => {
    try {
      fetch.mockResponse(`{"token":"exampleJWT"}`, { status: 200 });

      loginScript.el.username.value = 'username';
      loginScript.el.password.value = 'password';
      expect(await mockLoginUser()).toBe(undefined);
      expect(window.location.href).toEqual('index.html');
    } catch(err) {
      console.log(err);
    }

  });

  test("Test invalid logging in of a user (no user found)", async () => {
    try {
      fetch.mockResponse('', { status: 404 });

      loginScript.el.username.value = 'mrNobody';
      loginScript.el.password.value = 'password';
      expect(await mockLoginUser()).toBe(false);
      expect(window.location.href).toEqual('login.html');
      expect(loginScript.el.loginPopup.textContent).toEqual('Not Found');
    } catch(err) {
      console.log(err);
    }



  });

  test("Test invalid logging in of a user (incorrect password)", async () => {
    try {
      fetch.mockResponse('', { status: 403 });

      loginScript.el.username.value = 'username';
      loginScript.el.password.value = 'incorrectPassword';
      expect(await mockLoginUser()).toBe(false);
      expect(window.location.href).toEqual('login.html');
      expect(loginScript.el.loginPopup.textContent).toEqual('Incorrect Password');
    } catch(err) {
      console.log(err);
    }

  });

  test("Test invalid logging in of a user (bad request body)", async () => {
    try {
      fetch.mockResponse('', { status: 400 });

      loginScript.el.username.value = undefined;
      loginScript.el.password.value = 'incorrectPassword';
      expect(await mockLoginUser()).toBe(false);
      expect(window.location.href).toEqual('login.html');
      expect(loginScript.el.loginPopup.textContent).toEqual('Bad Request');
    } catch(err) {
      console.log(err);
    }

  });
});
