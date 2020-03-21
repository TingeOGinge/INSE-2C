const api = require('../front-end/client-side.js');

const exampleToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImFjY291bnRfdXNlcm5hbWUiOiJEaWxsb24iLCJhY2NvdW50X2lkIjoxNDUsImFkbWluX3N0YXR1cyI6dHJ1ZX0sImlhdCI6MTU4NDc3NjYxMSwiZXhwIjoxNTg0ODYzMDExfQ.jWPk1jinxvLuQuK_oFE6dh_nnPfRTUaGeOLMZTXtWuNfJSzdcSdeGS-q4TVoXEMhslZ7x-h9L5J2pgsjdNemKDsDafbrvTCdII1BZRZOfTrmRht__bwQm9CJ5DbnStwBu52AfUCrvaGnJCQR3UAcwkvbdSgiRwf4l5bAB_cT9sDmPR9FJFazeZc8QRCWANGLW5FrUZ7uFC95AX627DuxxSNOTStO298OjyHm80cFleN8zKYxms3tSpypG5qYgL5YMLEY8OAjtWR6eM2avlacatPoJKeoUaJzQ-ZP3wmwres383pEMJ72_AJHPHEEAiwQhEWOWYxodur0dUMaEA4gJA';

describe("Test the client-side API functions", () =>{

  beforeEach(() => {
    fetch.resetMocks();
  });

  test("Test registering a new user", async () => {
    fetch.mockResponses(
      [
        '',
        { status: 201 }
      ],
      [
        '',
        { status: 409 }
      ],
      [
        '',
        { status: 500 }
      ]
    );

    // Valid regsiter credentials
    const response = await api.registerUser(`[{"username":"username","password":"password"}]`);
    expect(response.status).toBe(201);
    expect(fetch.mock.results[0].type).toEqual('return');

    // Username conflict
    await expect(api.registerUser(`[{"username":"username","password":"password"}]`))
            .rejects.toThrow('Conflict');

    // Internal server error
    await expect(api.registerUser()).rejects.toThrow('Internal Server Error');
  });

  test("Test logging in", async () => {
    fetch.mockResponses(
      [
        `{"token":"${exampleToken}"}`,
        { status: 200 }
      ],
      [
        '',
        { status: 404 }
      ],
      [
        '',
        { status: 403 }
      ],
      [
        '',
        { status: 500 }
      ]
    );

    // Valid login
    const token = await api.login();
    expect(token).toEqual(exampleToken);

    // User not found
    await expect(api.login()).rejects.toThrow('Not Found');

    // Invalid password
    await expect(api.login()).rejects.toThrow('Forbidden');

    // Internal server error
    await expect(api.registerUser()).rejects.toThrow('Internal Server Error');
  });

});
