/*  registerUser and login input stucture is as follows:
    {
      username,
      password,
    }

    scheduleRecipe input structure is as follows:
    {

    }
*   Responses will be thrown if there is an error
*/

async function registerUser(data) {
  const url = 'http://localhost:5000/api/registerUser';
  const requestOptions = generatePostRequestOptions(data);
  const response = await fetch(url, requestOptions);

  if (!response.ok) throw response;
}

async function login(data) {
  const url = 'http://localhost:5000/api/login';
  const requestOptions = generatePostRequestOptions(data);
  const response = await fetch(url, requestOptions);

  if (!response.ok) throw response;
  const payload = await response.json();
  setClientToken(payload.token);
}

async function scheduleRecipe(data) {
  const url = 'http://localhost:5000/api/scheduleRecipe';
  const requestOptions = generatePostRequestOptions(data);
  const response = await fetch(url, requestOptions);

  if (!response.ok) throw response;
  setClientToken(response.token);
}

function generatePostRequestOptions(data) {
  const retval =  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  };
  const jwt = getJWT();
  if (jwt) retval.headers.authorization = "Bearer " + jwt;
  return retval;
}

function setClientToken(token) {
  localStorage.setItem('jwt', token);
}

function getJWT() {
  return localStorage.getItem('jwt');
}

function logout() {
  if (localStorage.jwt) localStorage.clearItem('jwt');
  window.location.href = 'index.html';
}

export {registerUser, login, scheduleRecipe, logout};
