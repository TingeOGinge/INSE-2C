const { Then } = require('@cucumber/cucumber');
const assert = require('assert');

Then ('the response body contains {string} {string}', async function (key, value) {
    const responseBody = await this.response.json();
    assert(responseBody[key] = value);
});
