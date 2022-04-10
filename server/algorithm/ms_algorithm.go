package algorithm

import (
	"net/url"
	"strings"

	"github.com/TingeOGinge/inse2c/server/database"
)

type AlgEnv struct {
	DB interface {
		MainSearch(parameters []string) ([]database.Recipe, error)
		GetRecipeByID(id int) (*database.Recipe, error)
	}
}

func (env AlgEnv) Search(urlQueries url.Values) ([]database.Recipe, error) {
	parameters := strings.Split(urlQueries.Get("parameters"), ",")

	recipes, err := env.DB.MainSearch(parameters)
	if err != nil {
		return nil, err
	}

	// TODO sort and filter the recipes 

	return recipes, nil
}

func (env AlgEnv) GetRecipe(id int) (*database.Recipe, error) {
	recipe, err := env.DB.GetRecipeByID(id)
	if err != nil {
		return nil, err
	}

	return recipe, nil

}