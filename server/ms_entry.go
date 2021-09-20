package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"net/url"

	"github.com/TingeOGinge/INSE-2C/server/database"
	"github.com/TingeOGinge/INSE-2C/server/algorithm"
	"github.com/jackc/pgx/v4/pgxpool"
)

type Env struct {
	algorithm interface {
		Search(parameters url.Values) ([]database.Recipe, error)
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

func makeHandler(fn func(http.ResponseWriter, *http.Request)) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
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
	}

	http.HandleFunc("/api/mainSearch", makeHandler(env.searchHandler))
	http.Handle("/", http.FileServer(http.Dir("./front-end")))
	
	log.Println("Server started on port 5000")
	log.Fatal(http.ListenAndServe(":5000", nil))
}