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

type MyClaims struct {
	ID *int `json:"id"`
	Username string `json:"username"`
	Admin bool `json:"admin"`
	jwt.StandardClaims
}

func (env AuthEnv) ValidateLogin (username, passwordAttempt string) (string, error) {
	user, err := env.DB.SelectAccount(username)
	if err != nil {
		return "", err
	}

	if !checkPassword(passwordAttempt, user.Password) {
		return "", fmt.Errorf("username or password is incorrect")
	}

	return generateToken(&user)
}

func (env AuthEnv) ValidateSession(tokenString string) (string, error) {
	token, err := jwt.ParseWithClaims(tokenString, &MyClaims{}, func(token *jwt.Token) (interface{}, error) {
		return signingKey, nil
	})

	if claims, ok := token.Claims.(*MyClaims); ok && token.Valid {
		return generateToken(&database.User{
			ID: claims.ID,
			Username: claims.Username,
			AdminStatus: claims.Admin,
		})
	} else {
		return "", err
	}
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

func generateToken(user *database.User) (string, error) {
	claims := MyClaims {
		user.ID,
		user.Username,
		user.AdminStatus,
		jwt.StandardClaims {
			ExpiresAt: 15000,
			Issuer: "ecochef",
		},

	}

	token := jwt.NewWithClaims(jwt.SigningMethodRS256, claims)

	return token.SignedString(signingKey)
}

func init() {
	var err error

	signingKey, err = rsa.GenerateKey(rand.Reader, 2048)
	if err != nil {
		log.Fatal(err)
	}
}