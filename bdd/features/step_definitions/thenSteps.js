const { Then } = require('@cucumber/cucumber');
const assert = require('assert');

Then ('the response body contains {string} {string}', async function (key, value) {
    let responseValue = this.response.jsonResponseBody[key];
    if (!isNaN(responseValue) && !isNaN(value)) {
        value = parseFloat(value);
    }
    assert.strictEqual(responseValue, value, `actual = ${responseValue} expected = ${value}`);
});
