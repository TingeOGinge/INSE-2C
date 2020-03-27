const profile = require('../front-end/javascript/profile.js');
const path = require('path');
const fs = require('fs');
const resultData = require('./results.json');

const HTML_TEMPLATE = fs.readFileSync(path.join(__dirname, '..', 'front-end', 'results.html'));
const LOAD_EVENT = new Event('load');

describe("Test profile.js", () => {

  beforeEach(() => {
    document.body.innerHTML = HTML_TEMPLATE;
    window.localStorage.clear();
    window.location.href = '/profile.html';
  });

  const dummyData = JSON.stringify([resultData.justChickenSearch[0]]);

  test("Test profile page with recipes scheduled", async () => {
    fetch.mockResponse(
      dummyData,
      { status: 200 }
    );
     try{
       await profile.pageLoaded();
     } catch(err) {
       console.log(err);
     }

    expect(document.querySelectorAll('.recipeContainer').length)
      .toEqual(JSON.parse(dummyData).length);
  });

  test("Test profile page with NO recipes scheduled", async () => {
    fetch.mockResponse(
      '',
      { status: 404 }
    );
     try{
       await profile.pageLoaded();
     } catch(err) {
       console.log(err);
     }

    expect(document.querySelectorAll('.promptContainer').length).toEqual(1);
  });


});
