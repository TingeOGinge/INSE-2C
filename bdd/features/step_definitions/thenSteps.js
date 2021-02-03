const { Then } = require('@cucumber/cucumber');
const assert = require('assert');

Then ('the response body contains {string} {string}', async function (key, value) {
    this.response.responseValue = this.response.jsonResponseBody[key];
    if (!isNaN(this.response.responseValue) && !isNaN(value)) {
        this.response.responseValue = parseFloat(this.response.responseValue);
        value = parseFloat(value);
    }
    assert(this.response.responseValue === value);
});
