package account

import (
	"github.com/TingeOGinge/inse2c/server/auth"
)

type AccEnv struct {
	DB interface{
		CreateAccount(string, string) (error)
	}
}

func (env AccEnv) CreateUser(username, password string) error {
	hash, err := auth.HashPassword(password)
	if err != nil {
		return err
	}
	if err := env.DB.CreateAccount(username, string(hash)); err != nil {
		return err
	}
	return nil
}