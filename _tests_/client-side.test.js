const api = require('../front-end/javascript/client-side.js');
const resultData = require('./results.json');

const exampleToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImFjY291bnRfdXNlcm5hbWUiOiJEaWxsb24iLCJhY2NvdW50X2lkIjoxNDUsImFkbWluX3N0YXR1cyI6dHJ1ZX0sImlhdCI6MTU4NDc3NjYxMSwiZXhwIjoxNTg0ODYzMDExfQ.jWPk1jinxvLuQuK_oFE6dh_nnPfRTUaGeOLMZTXtWuNfJSzdcSdeGS-q4TVoXEMhslZ7x-h9L5J2pgsjdNemKDsDafbrvTCdII1BZRZOfTrmRht__bwQm9CJ5DbnStwBu52AfUCrvaGnJCQR3UAcwkvbdSgiRwf4l5bAB_cT9sDmPR9FJFazeZc8QRCWANGLW5FrUZ7uFC95AX627DuxxSNOTStO298OjyHm80cFleN8zKYxms3tSpypG5qYgL5YMLEY8OAjtWR6eM2avlacatPoJKeoUaJzQ-ZP3wmwres383pEMJ72_AJHPHEEAiwQhEWOWYxodur0dUMaEA4gJA';


describe("Test the client-side API functions", () =>{

  beforeEach(() => {
    fetch.resetMocks();
  });

  const newDate = new Date();

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
    const token = await api.login(`[{"username":"username","password":"password"}]`);
    expect(token).toEqual(exampleToken);

    // User not found
    await expect(api.login(`[{"username":"username","password":"password"}]`))
      .rejects.toThrow('Not Found');

    // Invalid password
    await expect(api.login(`[{"username":"username","password":"notpassword"}]`))
      .rejects.toThrow('Forbidden');

    // Internal server error
    await expect(api.login()).rejects.toThrow('Internal Server Error');
  });


  test("Test scheduling a recipe", async () => {
    fetch.mockResponses(
      [
        '',
        { status: 200 }
      ],
      [
        '',
        { status: 404 }
      ],
      [
        `{"message":"Access Denied","err":"error message"}`,
        { status: 401 }
      ],
      [
        `{"token":"${exampleToken}"}`,
        { status: 409 }
      ],
      [
        '',
        { status: 500 }
      ]
    );

    // Valid attempt
    const response = await api.scheduleRecipe(`{"recipe_id":2,"scheduled_time":"${newDate}"}`);
    expect(response.status).toBe(200);

    // No JWT in request
    await expect(api.scheduleRecipe(`{"recipe_id":2,"scheduled_time":"${newDate}"}`))
      .rejects.toThrow('Not Found');

    // Token verification fail
    await expect(api.scheduleRecipe(`{"recipe_id":2,"scheduled_time":"${newDate}"}`))
      .rejects.toThrow('Unauthorized');

    // Schedule conflict
    await expect(api.scheduleRecipe(`{"recipe_id":2,"scheduled_time":"${newDate}"}`))
      .rejects.toThrow('Conflict');

    // Server error
    await expect(api.scheduleRecipe()).rejects.toThrow('Internal Server Error');
  });


  test("Test deleting a recipe from user's schedule", async () => {
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
        `{"message":"Access Denied","err":"error message"}`,
        { status: 401 }
      ],
      [
        `{"token":"${exampleToken}"}`,
        { status: 409 }
      ],
      [
        '',
        { status: 500 }
      ]
    );

    // Valid attempt
    const token = await api.deleteFromSchedule(`{"recipe_id":2,"scheduled_time":"${newDate}"}`);
    expect(token).toEqual(exampleToken);

    // No JWT in request
    await expect(api.deleteFromSchedule(`{"recipe_id":2,"scheduled_time":"${newDate}"}`))
      .rejects.toThrow('Not Found');

    // Token verification fail
    await expect(api.deleteFromSchedule(`{"recipe_id":2,"scheduled_time":"${newDate}"}`))
      .rejects.toThrow('Unauthorized');

    // Schedule conflict
    await expect(api.deleteFromSchedule(`{"recipe_id":2,"scheduled_time":"${newDate}"}`))
      .rejects.toThrow('Conflict');

    // Server error
    await expect(api.deleteFromSchedule()).rejects.toThrow('Internal Server Error');
  });


  test("Testing the search", async() => {
    fetch.mockResponses(
      [
        JSON.stringify(resultData.justChickenSearch),
        { status: 200 }
      ],
      [
        '',
        { status: 500 }
      ],
      [
        '',
        { status: 404 }
      ]
    );

    // Valid attempt
    const recipes = await api.search(`{"parameters":["chicken"]}`);
    expect(Array.isArray(recipes)).toEqual(true);
    expect(typeof recipes[0]).toEqual('object');
    expect(recipes.length > 0).toEqual(true);
    expect(recipes).toEqual(resultData.justChickenSearch);

    // Server error
    await expect(api.search(`{"parameters":["chicken"]}`))
      .rejects.toThrow('Internal Server Error');

    // No results found
    await expect(api.search(`{"parameters":["chicken"],"restrictions":["vegetarian"]}`))
      .rejects.toThrow('Not Found');

  });

});
