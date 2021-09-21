FROM golang:latest

WORKDIR /go/src/app

COPY . .
ENV DB_HOST "192.168.0.19"
ENV DB_PORT 5432
RUN apt-get update && \
    go get -u github.com/TingeOGinge/INSE-2C && \
    go install -v ./... && \
    apt-get install -f -y postgresql-client && \
    chmod +x wait-for-postgres.sh

ENTRYPOINT [ "./wait-for-postgres.sh" ]
