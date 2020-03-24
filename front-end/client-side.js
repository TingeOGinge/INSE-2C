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

  if (!response.ok) throw new Error(response.statusText);
  const payload = await response.json();
  return payload.token;
}

async function scheduleRecipe(data) {
  const url = 'http://localhost:5000/api/scheduleRecipe';
  const requestOptions = generateRequestOptions(data, 'POST');
  const response = await fetch(url, requestOptions);

  if (!response.ok) throw new Error(response.statusText);
  const payload = await response.json();
  return payload.token;
}

async function search(data) {
  const url = new URL('http://localhost:5000/api/mainSearch');
  url.search = new URLSearchParams(data).toString();
  const response = await fetch(url.href);

  if (!response.ok) throw new Error(response.statusText);
  const recipes = await response.json();
  return recipes;
}

function generateRequestOptions(type, data, token) {
  const retval =  {
    method: `${type}`,
    headers: { 'Content-Type': 'application/json' },
    body: (data) ? JSON.stringify(data) : undefined
  };
  if (token) retval.headers.authorization = `Bearer ${token}`;
  return retval;
}

if (typeof module === 'object') {
  const clientSideAPI = {registerUser, login, scheduleRecipe, search};
  module.exports = clientSideAPI;
}
