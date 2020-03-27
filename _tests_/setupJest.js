require('jest-fetch-mock').enableMocks();
const clientSideAPI = require('../front-end/javascript/client-side.js');

global.search = clientSideAPI.search;
global.registerUser = clientSideAPI.registerUser;
global.login = clientSideAPI.login;
global.getUserSchedule = clientSideAPI.getUserSchedule;

delete window.location;
global.window.location = {href: null};

process.on('unhandledRejection', (reason) => {
	console.log('REJECTION', reason);
});
