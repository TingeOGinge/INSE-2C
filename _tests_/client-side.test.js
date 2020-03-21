const crypto = require('crypto');
const api = require('../front-end/client-side.js');

const randomUsername = crypto.randomBytes(10).toString('hex');
const scheduledTime = new Date().toISOString();
const exampleToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImFjY291bnRfdXNlcm5hbWUiOiJEaWxsb24iLCJhY2NvdW50X2lkIjoxNDUsImFkbWluX3N0YXR1cyI6dHJ1ZX0sImlhdCI6MTU4NDc3NjYxMSwiZXhwIjoxNTg0ODYzMDExfQ.jWPk1jinxvLuQuK_oFE6dh_nnPfRTUaGeOLMZTXtWuNfJSzdcSdeGS-q4TVoXEMhslZ7x-h9L5J2pgsjdNemKDsDafbrvTCdII1BZRZOfTrmRht__bwQm9CJ5DbnStwBu52AfUCrvaGnJCQR3UAcwkvbdSgiRwf4l5bAB_cT9sDmPR9FJFazeZc8QRCWANGLW5FrUZ7uFC95AX627DuxxSNOTStO298OjyHm80cFleN8zKYxms3tSpypG5qYgL5YMLEY8OAjtWR6eM2avlacatPoJKeoUaJzQ-ZP3wmwres383pEMJ72_AJHPHEEAiwQhEWOWYxodur0dUMaEA4gJA';

describe("Test the client-side API functions", () =>{

  beforeEach(() => {
    fetch.resetMocks();
  });

  test("Test registering a valid new user", async () => {
    fetch.mockResponseOnce('', {status: 201});
    const response = await api.registerUser(`{"username": "${randomUsername}", "password": "password"}`);
    expect(response.status).toBe(201);
    expect(fetch.mock.results[0].type).toEqual('return');
  });

  test("Test registering an invalid new user", async () => {
    fetch.mockResponseOnce('', {status: 409});
    await expect(api.registerUser(`{"username": "${randomUsername}", "password": "password"}`)).rejects.toThrow('Conflict');
  });


});
