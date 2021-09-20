package algorithm

import (
	"net/url"

	"github.com/TingeOGinge/INSE-2C/server/database"
)

type AlgEnv struct {
	DB interface {
		MainSearch(parameters []string) ([]database.Recipe, error)
	}
}

func (env AlgEnv) Search(parameters url.Values) ([]database.Recipe, error) {
	recipes, err := env.DB.MainSearch(parameters["searchTerms"])
	if err != nil {
		return nil, err
	}

	// TODO sort and filter the recipes 

	return recipes, nil
}