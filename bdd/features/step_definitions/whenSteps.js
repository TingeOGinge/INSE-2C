const { When } = require('@cucumber/cucumber');

When ('I start the environment', async function () {   
    this.dbContainer = await this.dockerEnvironment.withExposedPorts(5432).withName('test').start();
});