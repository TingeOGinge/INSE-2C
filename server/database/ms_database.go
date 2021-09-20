package database

import (
	"context"
	"errors"
	"fmt"
	"strings"

	"github.com/jackc/pgx/pgtype"
	"github.com/jackc/pgx/v4/pgxpool"
)

type Recipe struct {
	ID int `json:"id"`
	Name string `json:"name"`
	CookingMinutes float64 `json:"cookingMinutes"`
	Method []string `json:"method"`
	Ingredients []string `json:"ingredients"`
	ServingSize int `json:"servingSize"`
	Calories int `json:"calories"`
	DietaryRestrictions []string `json:"dietaryRestrictions"`
}

type DbEnv struct {
	DBpool *pgxpool.Pool
}

func (r Recipe) String() string {
	return fmt.Sprintf("ID: %v\nName: %v\nCooking time: %v\nMethod: %v\nIngredients: %v" +
						"\nServing Size: %v\nCalories: %v\nDietary Restrictions: %v\n",
						r.ID, r.Name, r.CookingMinutes, r.Method, r.Ingredients, r.ServingSize, 
						r.Calories, r.DietaryRestrictions)
}

func (env DbEnv) MainSearch(parameters []string) ([]Recipe, error) {
	queryString := 
`SELECT  
DISTINCT a.recipe_id,  
a.recipe_name,  
EXTRACT(epoch FROM a.recipe_cooking_time)/60 as cooking_minutes,  
a.recipe_method,  
a.recipe_ingredients,  
a.recipe_serving_size,  
a.recipe_calories,  
ARRAY_AGG (DISTINCT e.diet_restriction_name) as dietary_restrictions  
FROM recipe a  
LEFT JOIN recipe_ingredient b ON a.recipe_id = b.recipe_id  
LEFT JOIN ingredient c on b.ingredient_id = c.ingredient_id  
LEFT JOIN recipe_dietary d on a.recipe_id = d.recipe_id  
LEFT JOIN dietary_restrictions e on d.diet_restriction_id = e.diet_restriction_id  
WHERE c.ingredient_name SIMILAR TO $1  
OR a.recipe_name SIMILAR TO $1 
GROUP BY a.recipe_id`

	if len(parameters) == 0 {
		return nil, errors.New("no search parameters provided")
	}

	// formats search parameters  '%search1|search2|search3%'
	// used in PostgreSQL as a boolean or between search parameters
	parameterString := fmt.Sprintf("%%%v%%", strings.Join(parameters, "|"))

	rows, err := env.DBpool.Query(context.Background(), queryString, parameterString)
	if err != nil {
		return nil, err
	}

	var recipes []Recipe
	for rows.Next() {
		var recipe Recipe
		var dietaryRestrictions pgtype.TextArray
		
		err = rows.Scan(&recipe.ID, &recipe.Name, &recipe.CookingMinutes, 
						&recipe.Method, &recipe.Ingredients, &recipe.ServingSize, 
						&recipe.Calories, &dietaryRestrictions)
		if err != nil {
			return nil, err
		}

		for _, value := range dietaryRestrictions.Elements {
			if value.Status == 2 {
				recipe.DietaryRestrictions = append(recipe.DietaryRestrictions, value.String)
			}
		}

		recipes = append(recipes, recipe)
	}

	return recipes, nil
}
