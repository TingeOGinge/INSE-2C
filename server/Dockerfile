FROM golang:latest

WORKDIR /go/src/app

COPY . .
RUN apt-get update && \
    go get -u github.com/TingeOGinge/INSE-2C && \
    go install -v ./... && \
    apt-get install -f -y postgresql-client && \
    chmod +x wait-for-postgres.sh

ENTRYPOINT [ "./wait-for-postgres.sh" ]
