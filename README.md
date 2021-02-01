# INSE-2C
Group 2 Team C INSE Project - Recipe Recommendations Webapp

Members:
 - TingeOGinge - Dillon Patrick O'Shea - UP887062
 - JamesDBardsley - James Bardsley - UP858234
 - Johnedreid - John Reid - UP889557
 - TMSG999 - Tiago Goncalves - UP898927
 - BenGaraffa - Benjamin Sebastian Garaffa - UP900263
 - napstA - Oliver George Walden Peters - UP896088

## Install the following to run this program locally

- Docker

## Program Initialisation

1. In your desired directory, open your terminal (or Git bash) and execute the following
    - `git clone https://github.com/TingeOGinge/INSE-2C`
2. Navigate to the INSE-2C folder
3. To correctly configure your local database host: 
    - Using a text editor, open `INSE-2C/server/Dockerfile`
    - Replace the value of `DB_HOST` with your local network host (the physical address)
      - To find your address on a Windows OS run `ipconfig` in command prompt to display your address.
      - Either double-click on the Network icon or use the View menu to select Network. Inside Network Preferences, select either Ethernet (for wired connections) or Wi-Fi on the left side, and your IP address will be displayed in the middle.
      - If you're using Linux, you should know what you're doing
    
4. Run the following command in you terminal
    - `docker compose up --build`
5. You're ready to go. In your browser, navigate to `localhost:5000` to begin using the prototype.
    - `127.0.0.1:5000` is an alternative to `localhost:5000`

## Testing 

There is a jest test suite in this project, that is no longer valid. The next stage of development for this project is to build a BDD test suite using Gherkin/Cucumber. I'd say watch this space, but realistically this is just for me to practice my skills.

## Project Documentation

To view the project's documentation please follow the link below
  - https://tingeoginge.github.io/INSE-2C/


## About The Project

The Ecochef webapp provides a simple way for users to find, schedule and share recipes based on ingredients they have.
