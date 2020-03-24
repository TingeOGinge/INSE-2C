require('jest-fetch-mock').enableMocks();
const clientSideAPI = require('../front-end/client-side.js');

global.search = clientSideAPI.search;
global.registerUser = clientSideAPI.registerUser;
global.login = clientSideAPI.login;

delete window.location;
global.window.location = {href: null};
