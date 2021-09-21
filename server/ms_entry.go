package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"net/url"

	"github.com/TingeOGinge/INSE-2C/server/algorithm"
	"github.com/TingeOGinge/INSE-2C/server/auth"
	"github.com/TingeOGinge/INSE-2C/server/database"
	"github.com/jackc/pgx/v4/pgxpool"
)

type Env struct {
	algorithm interface {
		Search(parameters url.Values) ([]database.Recipe, error)
	}
	auth interface {
		ValidateLogin(username, password string) (string, error)
		CreateUser(username, pasword string) error 
	}
}

func (env *Env) searchHandler (w http.ResponseWriter, r *http.Request) {
	recipes, err := env.algorithm.Search(r.URL.Query())
	if err != nil {
		errString := fmt.Sprintf("Error executing query: %v\n", err)
		http.Error(w, errString, http.StatusInternalServerError)
		log.Output(2, errString)
		return
	}
	
	payload, err := json.Marshal(recipes)
	if err != nil {
		errString := fmt.Sprintf("Error marshalling response: %v", err)
		http.Error(w, errString, http.StatusInternalServerError)
		log.Output(2, errString)
		return
	}

	if _, err := w.Write(payload); err != nil {
		errString := fmt.Sprintf("Error writing payload response: %v", err)
		http.Error(w, errString, http.StatusInternalServerError)
		log.Output(2, errString)
		return
	}
}

func (env *Env) createUserHandler(w http.ResponseWriter, r *http.Request) {
	var user database.User
	json.NewDecoder(r.Body).Decode(&user)

	if user.Username == "" && user.Password == "" {
		http.Error(w, "Username or password not included", http.StatusBadRequest)
		log.Output(2, "Username or password not included")
		return
	}

	if err := env.auth.CreateUser(user.Username, user.Password); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		log.Output(2, err.Error())
		return
	}
}

func (env *Env) loginHandler(w http.ResponseWriter, r *http.Request) {
	var user database.User
	json.NewDecoder(r.Body).Decode(&user)

	if user.Username == "" && user.Password == "" {
		http.Error(w, "Username or password not included", http.StatusBadRequest)
		log.Output(2, "Username or password not included")
		return
	}

	token, err := env.auth.ValidateLogin(user.Username, user.Password)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		log.Output(2, err.Error())
		return
	}
	
	if _, err := w.Write([]byte(token)); err != nil {
		errString := fmt.Sprintf("Error writing payload response: %v", err)
		http.Error(w, errString, http.StatusInternalServerError)
		log.Output(2, errString)
		return
	}
}

func makeHandler(fn func(http.ResponseWriter, *http.Request)) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		contentType := r.Header.Get("Content-Type")
		if contentType != "" && contentType != "application/json" {
			http.Error(w, http.StatusText(http.StatusBadRequest), http.StatusBadRequest)
			return
		} 

		w.Header().Set("Content-Type", "application/json")

		fn(w, r)
	}
}

func main() {
	url := "postgres://myuser:inse2c@localhost:5432/ecochefdb"
	dbpool, err := pgxpool.Connect(context.Background(), url)
	if err != nil {
		log.Fatal(fmt.Sprintf("Unable to connect to database: %v\n", err))
	}

	env := &Env{
		algorithm: algorithm.AlgEnv{
			DB: database.DbEnv{DBpool: dbpool},
		},
		auth: auth.AuthEnv{
			DB: database.DbEnv{DBpool: dbpool},
		},
	}

	http.HandleFunc("/api/mainSearch", makeHandler(env.searchHandler))
	http.HandleFunc("/api/registerUser", makeHandler(env.createUserHandler))
	http.HandleFunc("/api/login", makeHandler(env.loginHandler))
	http.Handle("/", http.FileServer(http.Dir("./front-end")))
	
	log.Println("Server started on port 5000")
	log.Fatal(http.ListenAndServe(":5000", nil))
}