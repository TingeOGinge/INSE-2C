const {AfterAll, BeforeAll, After} = require('@cucumber/cucumber');
const { DockerComposeEnvironment, Wait } = require("testcontainers");
const path = require('path');

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

After(async function () {
  this.response = undefined;
});

BeforeAll({ timeout: 60 * 1000 }, async function () {
  const composeFilePath = path.resolve(__dirname, "..", "..", "..");
  const composeFile = 'docker-compose.yml'

  this.environment = await new DockerComposeEnvironment(composeFilePath, composeFile)
    .withBuild()
    .withWaitStrategy("inse2c_server", Wait.forLogMessage("Server started on port 5000"))
    .up();
      
  this.server = this.environment.getContainer("inse2c_server");
});
    
AfterAll({ timeout: 60 * 1000 }, async function () {
  await this.environment.down();
});

