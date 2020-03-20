const request = require('supertest');
const path = require('path');
const app = require(path.join(__dirname, '..', 'ms_entry.js'));
const crypto = require('crypto');

describe("Test the root path", () => {
  test("It should respond to the GET with 200", async () => {
const randomUsername = crypto.randomBytes(10).toString('hex');
    const response = await request(app).get("/");
    expect(response.statusCode).toBe(200);
  });
});
