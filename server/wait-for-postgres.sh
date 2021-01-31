#!/bin/bash

DB_HOST="192.168.0.11"
DB_PORT="5432"

while ! pg_isready -h ${DB_HOST} -p ${DB_PORT} > /dev/null 2> /dev/null; do
    echo "Connecting to ${DB_HOST} Failed"
    sleep 1
done

# node db-data/populateRecipes.js
npm run start