const index = require('../front-end/javascript/index.js');
const path = require('path');
const fs = require('fs');
const resultData = require('./results.json');

const HTML_TEMPLATE = fs.readFileSync(path.join(__dirname, '..', 'front-end', 'index.html'));
const LOAD_EVENT = new Event('load');

function setWindowToIndex() {
  window.location.href = '/index.html';
}

describe("Test front-end/index.js", () => {

  beforeEach(() => {
    fetch.resetMocks();
    document.body.innerHTML = HTML_TEMPLATE;
    setWindowToIndex();
    dispatchEvent(LOAD_EVENT);
    index.el.ingredientArray = [];
    index.el.chosenRestrictions = [];
    window.localStorage.clear();
  });

  const mockSearchHandler = jest.fn(index.searchHandler);

  test("Test searching for recipes with chicken", async () => {
    fetch.mockResponse(JSON.stringify(resultData.justChickenSearch));
    index.el.searchBar.value = 'chicken';
    index.el.ingredientButton.click();
    await mockSearchHandler();

    expect(window.localStorage.__STORE__['searchResult']).toBeTruthy();
    expect(JSON.parse((localStorage.__STORE__['searchResult'])))
      .toEqual(resultData.justChickenSearch);
    expect(window.location.href).toEqual('results.html');
  });

  // Implemented to test multiple search parameters
  test("Test searching for chicken and potatotes", async () => {
    fetch.mockResponse(JSON.stringify(resultData.chickenAndPotatoes));
    index.el.searchBar.value = 'chicken';
    index.el.ingredientButton.click();
    index.el.searchBar.value = 'potatoes';
    index.el.ingredientButton.click();
    await mockSearchHandler();

    expect(window.localStorage.__STORE__['searchResult']).toBeTruthy();
    expect(JSON.parse((localStorage.__STORE__['searchResult'])))
      .toEqual(resultData.chickenAndPotatoes);
    expect(window.location.href).toEqual('results.html');

  });

  test("Test searching with parameters and filters", async () => {
    fetch.mockResponse(JSON.stringify(resultData.specificChickenPotatoes));
    index.el.searchBar.value = 'chicken';
    index.el.ingredientButton.click();
    index.el.searchBar.value = 'potatoes';
    index.el.ingredientButton.click();
    index.el.time.value = '180';
    index.el.cal.value = '500';
    index.el.serve.value = '4';
    index.el.restrictions.forEach((r) => {
      if (r.id === 'gluten-free') {
        r.checked = true;
      }
    });
    await mockSearchHandler();

    expect(window.localStorage.__STORE__['searchResult']).toBeTruthy();
    expect(JSON.parse((localStorage.__STORE__['searchResult'])))
      .toEqual(resultData.specificChickenPotatoes);
    expect(window.location.href).toEqual('results.html');
  });

  test("Test deleting elements from search parameters", () => {
    index.el.searchBar.value = 'chicken';
    index.el.ingredientButton.click();
    const searchParams = document.querySelectorAll('.param-chicken');
    expect(index.el.ingredientArray.length).toBe(1);
    expect(searchParams.length).toBe(2);
    expect(index.el.ingredientArray[0]).toBe('chicken');
    searchParams.forEach(elem => {
      if(elem.tagName === 'BUTTON') elem.click();
    });
    expect(index.el.ingredientArray.length === 0).toBe(true);
  });

});
