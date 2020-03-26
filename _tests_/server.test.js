const request = require('supertest');
const app = require('../server/ms_entry.js');
const crypto = require('crypto');
const {poolEnd} = require('../server/ms_database.js');
const resultData = require('./results.json');

const randomUsername = crypto.randomBytes(10).toString('hex');
Date.prototype.addHours = function(h) {
  this.setTime(this.getTime() + (h*60*60*1000));
  return this;
};
const scheduledTime = new Date().addHours(1).toISOString();

describe("Test the server routes", () => {

  afterAll(async () => {
    await poolEnd();
  });


  test("Test GET '/'", async () => {
    const response = await request(app).get("/");
    expect(response.statusCode).toBe(200);
  });


  test("Test POST '/api/registerUser'", async () => {
    // Valid attempt to regsiter
    const responseValid = await request(app).post('/api/registerUser')
      .set('Content-Type', 'application/json')
      .send(`{"username": "${randomUsername}", "password": "password"}`);
    expect(responseValid.statusCode).toBe(201);

    // Invalid attempt to register (username already taken)
    const responseDuplicate = await request(app).post('/api/registerUser')
      .set('Content-Type', 'application/json')
      .send(`{"username": "${randomUsername}", "password": "password"}`);
    expect(responseDuplicate.statusCode).toBe(409);

    // Invalid attempt to register (no username)
    const responseNoUsername = await request(app).post('/api/registerUser')
      .set('Content-Type', 'application/json')
      .send(`{"password": "password"}`);
    expect(responseNoUsername.statusCode).toBe(400);

    // Invalid attempt to register (no password)
    const responseNoPassword = await request(app).post('/api/registerUser')
      .set('Content-Type', 'application/json')
      .send(`{"name": "${randomUsername}2", "pass": "password"}`);
    expect(responseNoPassword.statusCode).toBe(400);
  });


  test("Test GET '/api/mainSearch'", async () => {
    // Valid search attempt looking to return an array with specific attributes
    const responseValid = await request(app).get('/api/mainSearch')
      .set('Content-Type', 'application/json')
      .query({"parameters": ["chicken", "potatoes"],"calories": 500,"serving": 4,"time": 180,"restrictions": ["gluten-free"]});
    expect(responseValid.statusCode).toBe(200);
    expect(Array.isArray(responseValid.body)).toEqual(true);
    expect(responseValid.body).toEqual(resultData.specificChickenPotatoes);

    // Valid search with just one string as a parameter
    const responseValid2 = await request(app).get('/api/mainSearch')
      .set('Content-Type', 'application/json')
      .query({"parameters": "chicken"});
    expect(responseValid2.statusCode).toBe(200);
    expect(Array.isArray(responseValid2.body)).toEqual(true);
    expect(typeof responseValid2.body[0] === 'object');
    expect(responseValid2.body).toEqual(resultData.justChickenSearch);

    // Valid search attempt looking to return 0 results
    const responseNoResults = await request(app).get('/api/mainSearch')
      .set('Content-Type', 'application/json')
      .query({"parameters": ["chicken"], "calories": 5, "serving": 1, "time": 1, "restrictions": ["vegetarian"]});
    expect(responseNoResults.statusCode).toBe(404);

    // Invalid search with mismatched types
    const responseBadTypes = await request(app).get('/api/mainSearch')
      .set('Content-Type', 'application/json')
      .query({"parameters": {}, "calories": '5', "serving": '1', "time": '1', "restrictions": ["vegetarian"]});
    expect(responseBadTypes.statusCode).toBe(400);

    // Invalid search attempt (no parameters)
    const responseNoParams = await request(app).get('/api/mainSearch')
      .set('Content-Type', 'application/json')
      .query({"calories": 5, "serving": 1, "time": 1, "restrictions": ["vegetarian"]});
    expect(responseNoParams.statusCode).toBe(400);

  });


  test("Test POST '/api/login'", async () => {

    // Valid attempt with token returned
    const response = await request(app).post('/api/login')
      .set('Content-Type', 'application/json')
      .send(`{"username": "${randomUsername}", "password": "password"}`);
    expect(response.statusCode).toBe(200);
    expect(typeof response.body).toEqual('object');
    expect(response.body.token).toBeTruthy();

    // Invalid attempt with incorrect username
    const responseBadUsername = await request(app).post('/api/login')
      .set('Content-Type', 'application/json')
      .send(`{"username": "${randomUsername.substring(5)}", "password": "password"}`);
    expect(responseBadUsername.statusCode).toBe(404);

    // Invalid attempt with incorrect password
    const responseBadPassword = await request(app).post('/api/login')
      .set('Content-Type', 'application/json')
      .send(`{"username": "${randomUsername}", "password": "incorrect"}`);
    expect(responseBadPassword.statusCode).toBe(403);

    // Invalid attempt with no username / password supplied
    const responseBadRequest = await request(app).post('/api/login')
      .set('Content-Type', 'application/json');
    expect(responseBadRequest.statusCode).toBe(400);

    // Invalid attempt with username / password types mismatched
    const responseBadTypes = await request(app).post('/api/login')
      .set('Content-Type', 'application/json')
      .send(`{"username": 0, "password": 1}`);
    expect(responseBadTypes.statusCode).toBe(400);
  });


  test("Test POST '/api/scheduleRecipe'", async () => {
    // Create session token to use in the test
    const loginResponse = await request(app).post('/api/login')
      .set('Content-Type', 'application/json')
      .send(`{"username": "${randomUsername}", "password": "password"}`);
    expect(loginResponse.statusCode).toBe(200);

    const token = loginResponse.body.token;

    // Valid attempt to schedule a recipe
    const responseValid = await request(app).post('/api/scheduleRecipe')
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send(`{"recipe_id": 2, "scheduled_time": "${scheduledTime}"}`);
    expect(responseValid.statusCode).toBe(200);

    // Invalid attempt to schedule a duplicate
    const responseDuplicate = await request(app).post('/api/scheduleRecipe')
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${loginResponse.body.token}`)
      .send(`{"recipe_id": 2, "scheduled_time": "${scheduledTime}"}`);
    expect(responseDuplicate.statusCode).toBe(409);

    // Invalid attempt with an invalid token
    const responseBadToken = await request(app).post('/api/scheduleRecipe')
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer invalidstring`)
      .send(`{"recipe_id": 2, "scheduled_time": "${scheduledTime}"}`);
    expect(responseBadToken.statusCode).toBe(401);

    // Invalid attempt with no session token
    const response = await request(app).post('/api/scheduleRecipe')
      .set('Content-Type', 'application/json')
      .send(`{"recipe_id": 2, "scheduled_time": "${scheduledTime}"}`);
    expect(response.statusCode).toBe(404);

    // Invalid attempt with bad parameters
    const responseBadParams = await request(app).post('/api/scheduleRecipe')
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send(`{"recipe_id": '-1', "scheduled_time": "time"`);
    expect(responseBadParams.statusCode).toBe(400);

    // Invalid attempt with no parameters
    const responseNoParams = await request(app).post('/api/scheduleRecipe')
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${token}`);
    expect(responseNoParams.statusCode).toBe(400);
  });


  test("GET '/api/getUserSchedule'", async () => {
    // Create session token to use in the test
    const loginResponse = await request(app).post('/api/login')
      .set('Content-Type', 'application/json')
      .send(`{"username": "${randomUsername}", "password": "password"}`);
    expect(loginResponse.statusCode).toBe(200);

    const token = loginResponse.body.token;

    // Valid attempt expecting results back
    const responseValid = await request(app).get('/api/getUserSchedule')
      .set('Authorization', `Bearer ${token}`);
    expect(responseValid.statusCode).toBe(200);
    expect(Array.isArray(responseValid.body)).toBe(true);
    expect(responseValid.body.length > 0).toBe(true);
    expect(typeof responseValid.body[0] === 'object');

    // Invalid attempt with invalid session token
    const responseBadToken = await request(app).get('/api/getUserSchedule')
      .set('Authorization', `Bearer invalidstring`);
    expect(responseBadToken.statusCode).toBe(401);

    // Invalid attempt with no session token
    const responseNoToken = await request(app).get('/api/getUserSchedule');
    expect(responseNoToken.statusCode).toBe(404);
  });


  test("Test POST '/api/deleteFromSchedule'", async () => {
    // Create session token to use in the test
    const loginResponse = await request(app).post('/api/login')
      .set('Content-Type', 'application/json')
      .send(`{"username": "${randomUsername}", "password": "password"}`);
    expect(loginResponse.statusCode).toBe(200);

    const token = loginResponse.body.token;

    // Valid attempt to delete a recipe from the schedule
    const responseValid = await request(app).post('/api/deleteFromSchedule')
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send(`{"recipe_id": 2, "scheduled_time": "${scheduledTime}"}`);
    expect(responseValid.statusCode).toBe(200);

    // Invalid attempt to delete a recipe no longer in the schedule
    const responseNoRecipe = await request(app).post('/api/deleteFromSchedule')
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send(`{"recipe_id": 2, "scheduled_time": "${scheduledTime}"}`);
    expect(responseNoRecipe.statusCode).toBe(404);

    // Invalid attempt to delete a recipe mismatched type parameters
    const responseBadParams = await request(app).post('/api/deleteFromSchedule')
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send(`{"recipe_id": '2', "scheduled_time": "invalidstring"}`);
    expect(responseBadParams.statusCode).toBe(400);

    // Invalid attempt to delete with invalid session credentials
    const responseBadToken = await request(app).post('/api/deleteFromSchedule')
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer invalidstring`)
      .send(`{"recipe_id": 2, "scheduled_time": "${scheduledTime}"}`);
    expect(responseBadToken.statusCode).toBe(401);

    // Invalid attempt to delete with no session credentials
    const responseNoToken = await request(app).post('/api/deleteFromSchedule')
      .set('Content-Type', 'application/json')
      .send(`{"recipe_id": 2, "scheduled_time": "${scheduledTime}"}`);
    expect(responseNoToken.statusCode).toBe(404);
  });
});
