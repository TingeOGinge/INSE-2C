package main

import (
	"net/http"
	"log"
	"fmt"
	"encoding/json"
)

func search (w http.ResponseWriter, r *http.Request) {
	recipes, err := Query("mainSearch", r.URL.Query()["searchTerms"])
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

	w.Header().Set("Content-Type", "application/json")
	if _, err := w.Write(payload); err != nil {
		errString := fmt.Sprintf("Error writing payload response: %v", err)
		http.Error(w, errString, http.StatusInternalServerError)
		log.Output(2, errString)
		return
	}
}

func App() {
	http.HandleFunc("/api/mainSearch", search)
	http.Handle("/", http.FileServer(http.Dir("./front-end")))
	
	log.Println("Server started on port 5000")
	log.Fatal(http.ListenAndServe(":5000", nil))
}