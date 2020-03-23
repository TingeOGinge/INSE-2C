require('jest-fetch-mock').enableMocks();
global.clientSideAPI = require('../front-end/client-side.js');

delete window.location;
global.window.location = {href: null};
