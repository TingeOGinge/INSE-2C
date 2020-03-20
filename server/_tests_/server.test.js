const request = require('supertest');
const path = require('path');
const app = require(path.join(__dirname, '..', 'ms_entry.js'));
const crypto = require('crypto');
const {poolEnd} = require(path.join(__dirname, '..', 'ms_database.js'));

const randomUsername = crypto.randomBytes(10).toString('hex');

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
});
