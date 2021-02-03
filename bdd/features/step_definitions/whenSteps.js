const { When } = require('@cucumber/cucumber');
const fetch = require('node-fetch');
const assert = require('assert');

When ('I call the api route {string}', async function (route) {   
    const url = `http://localhost:5000${route}`;
    this.response = await fetch(url);
    assert(this.response.ok);
});