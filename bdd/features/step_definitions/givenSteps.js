const { Given } = require('@cucumber/cucumber');
const fetch = require('node-fetch');
const assert = require('assert');

Given ('a live server', async function () {   
    const url = `http://localhost:5000/`;
    const response = await fetch(url);
    assert(response.ok);
});