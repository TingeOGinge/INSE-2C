module github.com/TingeOGinge/INSE-2C

go 1.17

replace github.com/TingeOGinge/INSE-2C/server/database => ./database

require (
	github.com/TingeOGinge/INSE-2C/server/algorithm v0.0.0-00010101000000-000000000000
	github.com/TingeOGinge/INSE-2C/server/database v0.0.0-00010101000000-000000000000
	github.com/jackc/pgx/v4 v4.13.0
)

require (
	github.com/jackc/chunkreader/v2 v2.0.1 // indirect
	github.com/jackc/pgconn v1.10.0 // indirect
	github.com/jackc/pgio v1.0.0 // indirect
	github.com/jackc/pgpassfile v1.0.0 // indirect
	github.com/jackc/pgproto3/v2 v2.1.1 // indirect
	github.com/jackc/pgservicefile v0.0.0-20200714003250-2b9c44734f2b // indirect
	github.com/jackc/pgtype v1.8.1 // indirect
	github.com/jackc/pgx v3.6.2+incompatible // indirect
	github.com/jackc/puddle v1.1.3 // indirect
	github.com/pkg/errors v0.9.1 // indirect
	golang.org/x/crypto v0.0.0-20210711020723-a769d52b0f97 // indirect
	golang.org/x/text v0.3.6 // indirect
)

replace github.com/TingeOGinge/INSE-2C/server/algorithm => ./algorithm