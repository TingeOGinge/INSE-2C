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
  return await response.json();
}

async function scheduleRecipe(data, token) {
  const url = 'http://localhost:5000/api/scheduleRecipe';
  const requestOptions = generatePostRequestOptions(data, token);
  const response = await fetch(url, requestOptions);

  if (!response.ok) throw response;
}

function generatePostRequestOptions(data, token) {
  const retval =  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  };
  if(token) retval.headers.authorization = "Bearer " + token;
  return retval;
}

export {registerUser, login, scheduleRecipe};
