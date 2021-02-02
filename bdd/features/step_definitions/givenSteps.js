const { Given } = require('@cucumber/cucumber');
const { GenericContainer } = require("testcontainers");
const path = require('path');

Given ('a docker config for the database', async function () {   
    const buildContext = path.resolve(__dirname, "..", "..", "..", "pg");
    this.dockerEnvironment = await GenericContainer.fromDockerfile(buildContext).build();
    // this.dbContainer = await this.dockerEnvironment.withExposedPorts(5432).withName('test').start();
    // this.dbContainer.
});