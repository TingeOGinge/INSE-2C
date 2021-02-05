FROM node:latest

WORKDIR /usr/src

COPY . .

RUN apt-get update && \
    npm install && \
    apt-get install -f -y postgresql-client && \
    chmod +x wait-for-postgres.sh

ENV DB_HOST "192.168.1.13"
ENV DB_PORT 5432

# CMD ["npm", "run", "start"]
ENTRYPOINT [ "./wait-for-postgres.sh" ]
