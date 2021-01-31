/* global module */


/**
 * @module Client Side Server API
 */

/** registerUser registers a new user ny passing in data in the form of a
* username and password in a JSON object. It calls on the generateRequestOptions
* function to stringify the data. Throws error if the response is not as expected
* @async
* @param {Object} data - JSON object containing username and password.
* @property {String} data.username - username for registering user
* @property {String} data.password - password for registering user
* @returns fetch() response object
* @throws Will throw an error if the status code is not okay (404 etc)
*/

async function registerUser(data) {
  const url = 'http://localhost:5000/api/registerUser';
  const requestOptions = generatePOSTRequestOptions(data);
  const response = await fetch(url, requestOptions);

  if (!response.ok) throw new Error(response.statusText);
  return response;
}

/** login logs the user in using a json object conatiaining username and password
* by stringifying the data passed through, waiting for a response from the login
* API using the stringified data and returning the payload's jwt. When the user
* has a jwt they are in a logged in session.
* @async
*@param {Object} data - JSON object containing username and password
*@property {String} data.username - username of user
*@property {String} data.password - password of user
* @returns {string} - JSON Web Token
* @throws Will throw if response status code is not okay
*/

async function login(data) {
  const url = 'http://localhost:5000/api/login';
  const requestOptions = generatePOSTRequestOptions(data);
  const response = await fetch(url, requestOptions);

  if (!response.ok) throw new Error(response.statusText);
  const payload = await response.json();
  return payload.token;
}

/** scheduleRecipe allows a user to schedule a recipe to a particular ISO 8601
* formatted time. The user must be logged in to do this as all scheduled recuoes
* are linked to accounts. It does this by stringifying the datetime plus recipe_id
*  and waiting for a response from the scheduleRecipe API. If successful the jwt
* is passed back. If unsuccessful an error is thrown.
* @async
* @param {Object} data l- JSON object containing date+time in ISO 8601 format and recipe id
* @property {datetime} data.scheduled_time- datetime for scheduled recipe in ISO 8601 format
* @property {Integer} data.recipe_id - ID to recipe that is being scheduled
* @param {String} token - jwt that is stored in local storage for future use
* @returns {object} fetch() response object
* @throws Will throw if response status code is not okay
*/

async function scheduleRecipe(data, token) {
  const url = 'http://localhost:5000/api/scheduleRecipe';
  const requestOptions = generatePOSTRequestOptions(data, token);
  const response = await fetch(url, requestOptions);

  if (!response.ok) throw new Error(response.statusText);
  return response;
}

/** deleteFromSchedule deletes a scheduled recipe from the user's account.
* It does this by stringifying the recipe_id and datetime and awaiting a response
* from the deleteFromSchedule API. If successful it returns the jwt. If unsuccessful
* it throws an error.
* @async
* @param {Object} data - JSON object containing date+time in ISO 8601 format and recipe id
* @property {datetime} data.scheduled_time - datetime for deleteFromSchedule in ISO 8601 format
* @property {Integer} data.recipe_id - ID to recipe that is being deleted
* @param {String} token - jwt that is stored in local storage for future use
* @returns {object} fetch() response object
* @throws Will throw if response status code is not okay
*/

async function deleteFromSchedule(data, token) {
  const url = 'http://localhost:5000/api/deleteFromSchedule';
  const requestOptions = generatePOSTRequestOptions(data, token);
  const response = await fetch(url, requestOptions);

  if (!response.ok) throw new Error(response.statusText);
  return response;
}

/** getUserSchedule gets the user's account's scheduled recipes.
* It does this by awaiting a response from the getUserSchedule API.
* If successful it returns the jwt. If unsuccessful it throws an error.
* @async
* @param token - jwt
* @returns {object[]} - Each object returned is a recipe in the user's schedule
* @throws Will throw if response status code is not okay
*/

async function getUserSchedule(token) {
  const url = 'http://localhost:5000/api/getUserSchedule';
  const requestOptions = {
    headers : {
      authorization: `Bearer ${token}`
    }
  };
  const response = await fetch(url, requestOptions);

  if (!response.ok) throw new Error(response.statusText);
  const schedule = await response.json();
  return schedule;
}

/** search takes search parameters (called data) and returns a list of recipes.
* It does this by passing the search data to URLSearchParams in the form of a
* string to be part of url.search. Recipes are returned after awaiting the url.href.
* if the response isnt what is to be expected it throws an error
*@async
*@param {object} data - search parameters that are put into the url search parameters
*@returns {object[]} - Each object returned is a recipe in the user's schedule
* @throws Will throw if response status code is not okay
*/

async function search(data) {
  const url = new URL('http://localhost:5000/api/mainSearch');
  url.search = new URLSearchParams(data).toString();
  const response = await fetch(url.href);

  if (!response.ok) throw new Error(response.statusText);
  const recipes = await response.json();
  return recipes;
}

/** getRecipe returns a recipe object from the server based on a given ID
 *  @param id - the id of the recipe you wish to return
 * @returns {object} Specified recipe
 * @throws Will throw if response status code is not okay
 */

async function getRecipe(id) {
  const url = `http://localhost:5000/api/getRecipe/${id}`;
  const response = await fetch(url);

  if (!response.ok) throw new Error(response.statusText);
  const recipe = await response.json();
  return recipe;
}

/** generateRequestOptions takes data and a jwt. If there is a token it will
* assign it to retval.headers.authorization. retval is returned containig the data
* requested as a string.
* @param {Object} data - data to be turned into a string
* @param {object} token - jwt
* @param {object} retval - returns data in body as a string
* @param {String} retval.headers.authorization - authorization string for returned value
* @returns {object} Formatted request options for fetch()
*/

function generatePOSTRequestOptions(data, token) {
  const retval =  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: (data) ? JSON.stringify(data) : undefined
  };
  if (token) retval.headers.authorization = `Bearer ${token}`;
  return retval;
}

if (typeof module === 'object') {
  module.exports = {
    registerUser,
    login,
    scheduleRecipe,
    search,
    deleteFromSchedule,
    getUserSchedule,
    getRecipe
  };
}
