const { Then } = require('@cucumber/cucumber');
const assert = require('assert');

Then ('the containers are running', async function () {
    console.log(this.dbContainer);
});

Then ('afterwards the container is stopped', async function () {
    await this.dbContainer.stop();
});