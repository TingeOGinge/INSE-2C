/* global module */

/** @module clientside.js
*/

/** registerUser registers a new user ny passing in data in the form of a
* username and password in a JSON object. It calls on the generateRequestOptions
* function to stringify the data. Throws error if the response is not as expected
* @param {Object} data - JSON object containing username and password.
* @param {String} data.username - username for registering user
* @param {String} data.password - password for registering user
* @param {Object} requestOptions - stringified username and password data
* @param {String} url - url to register User API
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
*@param {Object} data - JSON object containing username and password
*@param {String} data.username - username of user
*@param {String} data.password - password of user
*@param {Object} requestOptions -  stringified username and password data
*@param {String} url - url to login api
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
* are linked to accounts. It does this by stringifying the data+time plus username
*  and waiting for a response from the scheduleRecipe API. If successful the jwt
* is passed back. If un 
*
*/

async function scheduleRecipe(data, token) {
  const url = 'http://localhost:5000/api/scheduleRecipe';
  const requestOptions = generatePOSTRequestOptions(data, token);
  const response = await fetch(url, requestOptions);

  if (!response.ok) throw new Error(response.statusText);
  return response;
}

async function deleteFromSchedule(data, token) {
  const url = 'http://localhost:5000/api/deleteFromSchedule';
  const requestOptions = generatePOSTRequestOptions(data, token);
  const response = await fetch(url, requestOptions);

  if (!response.ok) throw new Error(response.statusText);
  return response;
}

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

async function search(data) {
  const url = new URL('http://localhost:5000/api/mainSearch');
  url.search = new URLSearchParams(data).toString();
  const response = await fetch(url.href);

  if (!response.ok) throw new Error(response.statusText);
  const recipes = await response.json();
  return recipes;
}

async function getRecipe(id) {
  const url = `http://localhost:5000/api/getRecipe/${id}`;
  const response = await fetch(url);

  if (!response.ok) throw new Error(response.statusText);
  const recipe = await response.json();
  return recipe;
}

/** generateRequestOptions takes data and a jwt. If there is a token it will
* assign it to retval.headers.authorization. retval is returned containig the data
* requested as a strubg.
* @param {Object} data - data to be turned into a string
* @param {object} token - jwt
* @param {object} retval - returns stringified data
* @param {String} retval.headers.authorization - authorization string for returned value
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
