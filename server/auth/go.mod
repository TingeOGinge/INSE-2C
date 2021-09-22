module github.com/TingeOGinge/inse2c/server/auth

go 1.17

replace github.com/TingeOGinge/inse2c/server/database => ../database

require (
	github.com/TingeOGinge/inse2c/server/database v0.0.0-00010101000000-000000000000
	github.com/golang-jwt/jwt v3.2.2+incompatible
	golang.org/x/crypto v0.0.0-20210920023735-84f357641f63
)

require (
	github.com/jackc/chunkreader/v2 v2.0.1 // indirect
	github.com/jackc/pgconn v1.10.0 // indirect
	github.com/jackc/pgio v1.0.0 // indirect
	github.com/jackc/pgpassfile v1.0.0 // indirect
	github.com/jackc/pgproto3/v2 v2.1.1 // indirect
	github.com/jackc/pgservicefile v0.0.0-20200714003250-2b9c44734f2b // indirect
	github.com/jackc/pgtype v1.8.1 // indirect
	github.com/jackc/pgx/v4 v4.13.0 // indirect
	github.com/jackc/puddle v1.1.4 // indirect
	golang.org/x/text v0.3.7 // indirect
)
