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
});
