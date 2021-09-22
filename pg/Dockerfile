FROM postgres:latest

ENV POSTGRES_USER=myuser
ENV POSTGRES_PASSWORD=inse2c

USER 1000:1000

COPY ./db-scripts/ecochefdb.sql /docker-entrypoint-initdb.d/