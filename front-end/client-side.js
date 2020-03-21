/* global module */

async function registerUser(data) {
  const url = 'http://localhost:5000/api/registerUser';
  const requestOptions = generateRequestOptions(data, 'POST');
  const response = await fetch(url, requestOptions);

  if (!response.ok) throw new Error(response.statusText);
  return response;
}

async function login(data) {
  const url = 'http://localhost:5000/api/login';
  const requestOptions = generateRequestOptions(data, 'POST');
  const response = await fetch(url, requestOptions);

  if (!response.ok) throw response;
  const payload = await response.json();
  return {response, token: payload.token};
}

async function scheduleRecipe(data) {
  const url = 'http://localhost:5000/api/scheduleRecipe';
  const requestOptions = generateRequestOptions(data, 'POST');
  const response = await fetch(url, requestOptions);

  if (!response.ok) throw response;
  return response;
}

async function search(data) {
  const url = 'http://localhost:5000/api/search';
  const requestOptions = generateRequestOptions(data, 'GET');
  const response = await fetch(url, requestOptions);

  if (!response.ok) throw response;
  const recipes = await response.json();
  return {response, recipes};
}

function generateRequestOptions(data, type, token) {
  const retval =  {
    method: `${type}`,
    headers: { 'Content-Type': 'application/json' },
    body: (data) ? JSON.stringify(data) : undefined
  };
  if (token) retval.headers.authorization = `Bearer ${token}`;
  return retval;
}

if (typeof module === 'object') {
  module.exports = {registerUser, login, scheduleRecipe, search};
}
