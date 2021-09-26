package main

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"net/url"

	"github.com/TingeOGinge/inse2c/server/account"
	"github.com/TingeOGinge/inse2c/server/algorithm"
	"github.com/TingeOGinge/inse2c/server/auth"
	"github.com/TingeOGinge/inse2c/server/database"
	"github.com/jackc/pgx/v4/pgxpool"
)

type Env struct {
	algorithm interface {
		Search(parameters url.Values) ([]database.Recipe, error)
	}
	auth interface {
		ValidateLogin(username, password string) (string, error)
		ValidateSession(authHeader string) (string, *database.User, error)
	}
	acc interface {
		CreateUser(username, pasword string) error 
		ScheduleRecipe(body io.ReadCloser, user *database.User) error
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

	if err := env.acc.CreateUser(user.Username, user.Password); err != nil {
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

func (env *Env) scheduleRecipeHandler(w http.ResponseWriter, r *http.Request) {
	token, user, err := env.auth.ValidateSession(r.Header.Get("Authorization"))
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		log.Output(2, err.Error())
		return
	}

	if err = env.acc.ScheduleRecipe(r.Body, user); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		log.Output(2, err.Error())
		return
	}

	if _, err = w.Write([]byte(token)); err != nil {
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
	url := "postgres://myuser:inse2c@db:5432/ecochefdb"
	dbpool, err := pgxpool.Connect(context.Background(), url)
	if err != nil {
		log.Fatal(fmt.Sprintf("Unable to connect to database: %v\n", err))
	}

	dbEnv := &database.DbEnv {DBpool: dbpool}

	env := &Env{
		algorithm: algorithm.AlgEnv{
			DB: dbEnv,
		},
		auth: auth.AuthEnv{
			DB: dbEnv,
		},
		acc: account.AccEnv{
			DB: dbEnv,
		},
	}

	http.HandleFunc("/api/mainSearch", makeHandler(env.searchHandler))
	http.HandleFunc("/api/registerUser", makeHandler(env.createUserHandler))
	http.HandleFunc("/api/login", makeHandler(env.loginHandler))
	http.HandleFunc("/api/scheduleRecipe", makeHandler(env.scheduleRecipeHandler))
	http.Handle("/", http.FileServer(http.Dir("./front-end")))
	
	log.Println("Server started on port 5000")
	log.Fatal(http.ListenAndServe(":5000", nil))
}