const index = require('../front-end/index.js');
const path = require('path');
const fs = require('fs');
const resultData = require('./index.json');

const HTML_TEMPLATE = fs.readFileSync(path.join(__dirname, '..', 'front-end', 'index.html'));
const LOAD_EVENT = new Event('load');

describe("Test front-end/index.js", () => {

  beforeEach(() => {
    fetch.resetMocks();
  });

  test("Test searching for a recipe", async () => {
    fetch.mockResponses(
      [
        JSON.stringify(resultData.justChickenSearch),
        { status: 200 }
      ],
      [
        '',
        { status: 500 }
      ],
      [
        '',
        { status: 404 }
      ]
    );
    const mockSearchHandler = jest.fn(index.searchHandler);
    document.body.innerHTML = HTML_TEMPLATE;
    dispatchEvent(LOAD_EVENT);
    index.el.searchBar.value = 'chicken';
    index.el.ingredientButton.click();
    await mockSearchHandler();
    console.log(window.location.href);

    expect(window.localStorage.__STORE__['searchResult']).toBeTruthy();
    expect(JSON.parse((localStorage.__STORE__['searchResult'])))
      .toEqual(resultData.justChickenSearch);

  });

});
