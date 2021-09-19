FROM node:latest

WORKDIR /usr/src

COPY . .
USER root
ENV DB_HOST "192.168.0.19"
ENV DB_PORT 5432
RUN apt-get update && \
    npm install && \
    apt-get install -f -y postgresql-client && \
    chmod +x wait-for-postgres.sh

ENTRYPOINT [ "./wait-for-postgres.sh" ]
