#!/bin/bash

while ! pg_isready -h db -p 5432 > /dev/null 2> /dev/null; do
    echo "Connecting to ${DB_HOST} Failed"
    sleep 1
done

inse2c