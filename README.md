# INSE-2C
Group 2 Team C INSE Project - Recipe Recommendations Webapp

## Install the following to run this program locally

- PostgreSQL - Listening on `port 5432`
 - Access to the database terminal is needed to follow this guide exactly
- NodeJS
- Git

## Program Initialisation

1. In your desired directory, open your terminal (or Git bash) and execute the following
  - `git clone https://github.com/TingeOGinge/INSE-2C`
2. Navigate to the INSE-2C folder
3. Install the necessary node packages with the following command
  - `npm i`
4. Open your PostgreSQL terminal and copy the contents of the file located at
  - `server/db-scripts/create_tables.sql`
5. In your bash terminal (or Git Bash) execute the following command (from the project's root directory)
  - `node server/db-scripts/populateRecipes.js`
  - This will take a few momments, please be patient
5. To ensure the installation has been successful run the following command anywhere in the project folder
  - `npx jest --silent`
  - This will run all of our automated tests without outputting the console logs. These occur as expected when we test invalid cases and whilst they are useful to the project they make the test results look cluttered. To view the results with `npm run test`
6. To begin using the prototype run the following command
  - `npm run start`
7. You're ready to go. In your browser, navigate to `localhost:5000` to begin using the prototype.
  - `127.0.0.1:5000` is an alternative to `localhost:5000`

## Project Documentation

To view the project's documentation please follow the link below
  - https://tingeoginge.github.io/INSE-2C/


## About The Project

The Ecochef webapp provides a simple way for users to find, schedule and share recipes based on ingredients they have.
