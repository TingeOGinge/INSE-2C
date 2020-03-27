const recipe = require('../front-end/javascript/recipe.js');
const path = require('path');
const fs = require('fs');
const resultData = require('./results.json');

const HTML_TEMPLATE = fs.readFileSync(path.join(__dirname, '..', 'front-end', 'recipe.html'));

describe("Test recipe.js", () => {

  beforeEach(() => {
    document.body.innerHTML = HTML_TEMPLATE;
    window.localStorage.clear();
    window.location.href = '/recipe.html';
  });

  const dummyData = JSON.stringify(resultData.justChickenSearch[0]);

  test("Test loading recipe from localStorage", async () => {
    window.localStorage.setItem('chosenRecipe', dummyData);
    await recipe.pageLoaded();
    expect(document.querySelectorAll('.ingredientElem').length)
      .toBe(resultData.justChickenSearch[0].recipe_ingredients.length);
    expect(document.querySelectorAll('.methodElem').length)
      .toBe(resultData.justChickenSearch[0].recipe_method.length);
  });

  test("Test invalid loading recipe from localStorage", async () => {
    await recipe.pageLoaded();
    expect(window.location.href).toEqual('/');
  });
});
