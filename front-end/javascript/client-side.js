/* global module */

/** @module clientside.js
*/



async function registerUser(data) {
  const url = 'http://localhost:5000/api/registerUser';
  const requestOptions = generatePOSTRequestOptions(data);
  const response = await fetch(url, requestOptions);

  if (!response.ok) throw new Error(response.statusText);
  return response;
}

async function login(data) {
  const url = 'http://localhost:5000/api/login';
  const requestOptions = generatePOSTRequestOptions(data);
  const response = await fetch(url, requestOptions);

  if (!response.ok) throw new Error(response.statusText);
  const payload = await response.json();
  return payload.token;
}

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
