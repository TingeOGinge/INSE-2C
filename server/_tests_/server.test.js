const request = require('supertest');
const path = require('path');
const app = require(path.join(__dirname, '..', 'ms_entry.js'));

describe("Test the root path", () => {
  test("It should respond to the GET with 200", async () => {
    const response = await request(app).get("/");
    expect(response.statusCode).toBe(200);
  });
});
