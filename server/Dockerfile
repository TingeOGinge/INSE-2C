FROM node:latest

WORKDIR /usr/src

COPY . .
USER root
RUN apt-get update && \
    npm install && \
    apt-get install -f -y postgresql-client && \
    chmod +x wait-for-postgres.sh
# && node ./db-data/populateRecipes.js

# CMD ["npm", "run", "start"]
ENTRYPOINT [ "./wait-for-postgres.sh" ]
