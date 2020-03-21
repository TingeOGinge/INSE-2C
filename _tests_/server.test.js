const request = require('supertest');
const path = require('path');
const app = require('../server/ms_entry.js');
const crypto = require('crypto');
const {poolEnd} = require('../server/ms_database.js');

const randomUsername = crypto.randomBytes(10).toString('hex');
const scheduledTime = new Date().toISOString();

describe("Test the server routes", () => {

  afterAll(async () => {
    await poolEnd();
  });

  test("GET '/' should respond with 200", async () => {
    const response = await request(app).get("/");
    expect(response.statusCode).toBe(200);
  });

  test("POST '/api/registerUser' with valid credentials", async () => {
    const response = await request(app).post('/api/registerUser')
      .set('Content-Type', 'application/json')
      .send(`{"username": "${randomUsername}", "password": "password"}`);
    expect(response.statusCode).toBe(201);
  });

  test("POST '/api/registerUser' with same (now invalid) credentials", async () => {
    const response = await request(app).post('/api/registerUser')
      .set('Content-Type', 'application/json')
      .send(`{"username": "${randomUsername}", "password": "password"}`);
    expect(response.statusCode).toBe(409);
  });

  test("GET '/api/mainSearch' expecting specific results back", async () => {
    const response = await request(app).get('/api/mainSearch')
      .set('Content-Type', 'application/json')
      .send(`{"parameters": ["chicken", "potatoes"],"calories": 500,"serving": 4,"time": 180,"restrictions": ["gluten-free"]}`);
    expect(response.statusCode).toBe(200);
    expect(response.body[0].recipe_id).toEqual(344);
    expect(response.body.length).toEqual(50);
    expect(response.body.slice(-1)[0].recipe_id).toEqual(749);
  });

  test("GET '/api/mainSearch' expecting no results back", async () => {
    const response = await request(app).get('/api/mainSearch')
      .set('Content-Type', 'application/json')
      .send(`{"parameters": ["chicken"], "calories": 5, "serving": 1, "time": 1, "restrictions": ["vegetarian"]}`);
    expect(response.statusCode).toBe(404);
  });

  test("POST '/api/login' with valid credentials", async () => {
    const response = await request(app).post('/api/login')
      .set('Content-Type', 'application/json')
      .send(`{"username": "${randomUsername}", "password": "password"}`);
    expect(response.statusCode).toBe(200);
  });

  test("POST '/api/login' with invalid username credentials", async () => {
    const response = await request(app).post('/api/login')
      .set('Content-Type', 'application/json')
      .send(`{"username": "${randomUsername.substring(5)}", "password": "password"}`);
    expect(response.statusCode).toBe(404);
  });

  test("POST '/api/login' with invalid password credentials", async () => {
    const response = await request(app).post('/api/login')
      .set('Content-Type', 'application/json')
      .send(`{"username": "${randomUsername}", "password": "incorrect"}`);
    expect(response.statusCode).toBe(403);
  });

  test("POST '/api/scheduleRecipe' with valid parameters", async () => {
    const loginResponse = await request(app).post('/api/login')
      .set('Content-Type', 'application/json')
      .send(`{"username": "${randomUsername}", "password": "password"}`);
    expect(loginResponse.statusCode).toBe(200);

    const response = await request(app).post('/api/scheduleRecipe')
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${loginResponse.body.token}`)
      .send(`{"recipe_id": 2, "scheduled_time": "${scheduledTime}"}`);
    expect(response.statusCode).toBe(200);
  });

  test("POST '/api/scheduleRecipe' with same (now invalid) parameters", async () => {
    const loginResponse = await request(app).post('/api/login')
      .set('Content-Type', 'application/json')
      .send(`{"username": "${randomUsername}", "password": "password"}`);
    expect(loginResponse.statusCode).toBe(200);

    const response = await request(app).post('/api/scheduleRecipe')
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${loginResponse.body.token}`)
      .send(`{"recipe_id": 2, "scheduled_time": "${scheduledTime}"}`);
    expect(response.statusCode).toBe(409);
  });

  test("POST '/api/scheduleRecipe' with invalid session credentials", async () => {
    const loginResponse = await request(app).post('/api/login')
      .set('Content-Type', 'application/json')
      .send(`{"username": "${randomUsername}", "password": "password"}`);
    expect(loginResponse.statusCode).toBe(200);

    const response = await request(app).post('/api/scheduleRecipe')
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${loginResponse.body.token}invalidstring`)
      .send(`{"recipe_id": 2, "scheduled_time": "${scheduledTime}"}`);
    expect(response.statusCode).toBe(401);
  });

  test("POST '/api/scheduleRecipe' with no session credentials", async () => {
    const response = await request(app).post('/api/scheduleRecipe')
      .set('Content-Type', 'application/json')
      .send(`{"recipe_id": 2, "scheduled_time": "${scheduledTime}"}`);
    expect(response.statusCode).toBe(404);
  });

  test("GET '/api/getUserSchedule' with valid session credentials", async () => {
    const loginResponse = await request(app).post('/api/login')
      .set('Content-Type', 'application/json')
      .send(`{"username": "${randomUsername}", "password": "password"}`);
    expect(loginResponse.statusCode).toBe(200);

    const response = await request(app).get('/api/getUserSchedule')
      .set('Authorization', `Bearer ${loginResponse.body.token}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.length > 0).toBe(true);
  });

  test("GET '/api/getUserSchedule' with invalid session credentials", async () => {
    const loginResponse = await request(app).post('/api/login')
      .set('Content-Type', 'application/json')
      .send(`{"username": "${randomUsername}", "password": "password"}`);
    expect(loginResponse.statusCode).toBe(200);

    const response = await request(app).get('/api/getUserSchedule')
      .set('Authorization', `Bearer ${loginResponse.body.token}invalidstring`);
    expect(response.statusCode).toBe(401);
  });

  test("GET '/api/getUserSchedule' with no session credentials", async () => {
    const response = await request(app).get('/api/getUserSchedule');
    expect(response.statusCode).toBe(404);
  });

  test("POST '/api/deleteFromSchedule' with invalid session credentials", async () => {
    const loginResponse = await request(app).post('/api/login')
      .set('Content-Type', 'application/json')
      .send(`{"username": "${randomUsername}", "password": "password"}`);
    expect(loginResponse.statusCode).toBe(200);

    const response = await request(app).post('/api/deleteFromSchedule')
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${loginResponse.body.token}invalidstring`)
      .send(`{"recipe_id": 2, "scheduled_time": "${scheduledTime}"}`);
    expect(response.statusCode).toBe(401);
  });

  test("POST '/api/deleteFromSchedule' with valid parameters", async () => {
    const loginResponse = await request(app).post('/api/login')
      .set('Content-Type', 'application/json')
      .send(`{"username": "${randomUsername}", "password": "password"}`);
    expect(loginResponse.statusCode).toBe(200);

    const response = await request(app).post('/api/deleteFromSchedule')
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${loginResponse.body.token}`)
      .send(`{"recipe_id": 2, "scheduled_time": "${scheduledTime}"}`);
    expect(response.statusCode).toBe(200);
  });

  test("POST '/api/deleteFromSchedule' with the same (now invalid) parameters", async () => {
    const loginResponse = await request(app).post('/api/login')
      .set('Content-Type', 'application/json')
      .send(`{"username": "${randomUsername}", "password": "password"}`);
    expect(loginResponse.statusCode).toBe(200);

    const response = await request(app).post('/api/deleteFromSchedule')
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${loginResponse.body.token}`)
      .send(`{"recipe_id": 2, "scheduled_time": "${scheduledTime}"}`);
    expect(response.statusCode).toBe(404);
  });

});
