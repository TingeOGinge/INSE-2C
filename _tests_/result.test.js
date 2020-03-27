const loadRecipes = require('../front-end/javascript/results.js');
const path = require('path');
const fs = require('fs');
const resultData = require('./results.json');

const HTML_TEMPLATE = fs.readFileSync(path.join(__dirname, '..', 'front-end', 'results.html'));
const LOAD_EVENT = new Event('load');

describe("Test results.js", () => {

  beforeEach(() => {
    document.body.innerHTML = HTML_TEMPLATE;
    window.localStorage.clear();
  });

  const dummyData = JSON.stringify(resultData.justChickenSearch);

  test("Test with recipe in localStorage", async () => {
    try {
      window.localStorage.setItem('searchResult', dummyData);
      dispatchEvent(LOAD_EVENT);
      expect(loadRecipes.el.recipes.length)
        .toEqual(document.querySelectorAll('.recipeContainer').length);
      expect(loadRecipes.el.recipes.length).toEqual(resultData.justChickenSearch.length);
    } catch(err) {
      console.log(err);
    }

  });

  test("Test with recipe NOT in localStorage", async () => {
    try {
      dispatchEvent(LOAD_EVENT);
      expect(window.location.href).toEqual('/');
    } catch(err) {
      console.log(err);
    }

  });

});
