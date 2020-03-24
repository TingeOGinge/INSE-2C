const register = require('../front-end/register.js');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const HTML_TEMPLATE = fs.readFileSync(path.join(__dirname, '..', 'front-end', 'register.html'));
const LOAD_EVENT = new Event('load');

const randomUsername = crypto.randomBytes(10).toString('hex');
// const scheduledTime = new Date().toISOString();

function resetWindowLocation() {
  window.location.href = 'register.html';
}

describe("Test front-end/index.js", () => {

  beforeEach(() => {
    fetch.resetMocks();
    document.body.innerHTML = HTML_TEMPLATE;
    resetWindowLocation();
    dispatchEvent(LOAD_EVENT);
  });

  const mockRegister = jest.fn(register.register);

  test("Test valid registering of a user", async () => {
    fetch.mockResponse('', { status: 201 });

    register.el.username.value = randomUsername;
    register.el.password.value = 'password';
    await mockRegister();
    expect(window.location.href).toEqual('login.html');
  });

  test("Test duplicate registering of a user", async () => {
    fetch.mockResponse('', { status: 409 });

    register.el.username.value = randomUsername;
    register.el.password.value = 'password';
    expect(await mockRegister()).toBe(false);
    expect(window.location.href).toEqual('register.html');
  });

});
