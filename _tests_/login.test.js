const loginScript = require('../front-end/login.js');
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
    fetch.mockResponse(`{"token":"exampleJWT"}`, { status: 200 });

    loginScript.el.username.value = 'username';
    loginScript.el.password.value = 'password';
    expect(await mockLoginUser()).toBe(undefined);
    expect(window.location.href).toEqual('index.html');
  });

  test("Test invalid logging in of a user (no user found)", async () => {
    fetch.mockResponse('', { status: 404 });

    loginScript.el.username.value = 'mrNobody';
    loginScript.el.password.value = 'password';
    expect(await mockLoginUser()).toBe(false);
    expect(window.location.href).toEqual('login.html');
  });

  test("Test invalid logging in of a user (incorrect password)", async () => {
    fetch.mockResponse('', { status: 403 });

    loginScript.el.username.value = 'username';
    loginScript.el.password.value = 'incorrectPassword';
    expect(await mockLoginUser()).toBe(false);
    expect(window.location.href).toEqual('login.html');
  });
});
