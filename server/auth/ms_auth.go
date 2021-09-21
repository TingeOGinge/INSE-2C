package auth

import (
	"crypto/rand"
	"crypto/rsa"
	"fmt"
	"log"

	"github.com/TingeOGinge/INSE-2C/server/database"

	"github.com/golang-jwt/jwt"
	"golang.org/x/crypto/bcrypt"
)

var (
	signingKey *rsa.PrivateKey
)

type AuthEnv struct {
	DB interface {
		SelectAccount(string) (database.User, error)
		CreateAccount(string, string) (error)
	}
}

func (env AuthEnv) ValidateLogin (username string, passwordAttempt string) (string, error) {
	user, err := env.DB.SelectAccount(username)
	if err != nil {
		return "", err
	}

	if !checkPassword(passwordAttempt, user.Password) {
		return "", fmt.Errorf("username or password is incorrect")
	}

	token := jwt.NewWithClaims(jwt.SigningMethodRS256, jwt.MapClaims{
		"id": user.ID,
		"username": user.Username,
		"admin": user.AdminStatus,
	})

	return token.SignedString(signingKey)
}

func (env AuthEnv) CreateUser(username, password string) error {
	hash, err := hashPassword(password)
	if err != nil {
		return err
	}
	if err := env.DB.CreateAccount(username, string(hash)); err != nil {
		return err
	}
	return nil
}

func hashPassword(password string) ([]byte, error) {
	return bcrypt.GenerateFromPassword([]byte(password), 10)
}

func checkPassword(password, hash string) bool {
	return bcrypt.CompareHashAndPassword([]byte(hash), []byte(password)) == nil
}

func init() {
	var err error

	signingKey, err = rsa.GenerateKey(rand.Reader, 2048)
	if err != nil {
		log.Fatal(err)
	}
}