const {AfterAll, BeforeAll, After} = require('@cucumber/cucumber');

After(async function () {
    this.response = null;
});
