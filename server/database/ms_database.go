package database

import (
	"context"
	"errors"
	"fmt"
	"strings"

	"github.com/jackc/pgx/v4/pgxpool"
)

type Recipe struct {
	ID int `json:"recipe_id"`
	Name string `json:"recipe_name"`
	CookingMinutes float64 `json:"cooking_minutes"`
	Method []string `json:"recipe_method"`
	Ingredients []string `json:"recipe_ingredients"`
	ServingSize int `json:"recipe_serving_size"`
	Calories int `json:"recipe_calories"`
	DietaryRestrictions []*string `json:"dietary_restrictions"`
}

type User struct {
	ID *int `json:"id"`
	Username string `json:"username"`
	Password string `json:"password"`
	AdminStatus bool `json:"adminStatus"`
}

type DbEnv struct {
	DBpool *pgxpool.Pool
}

var recipeQueryPrefix string

func (r Recipe) String() string {
	return fmt.Sprintf("ID: %v\nName: %v\nCooking time: %v\nMethod: %v\nIngredients: %v" +
						"\nServing Size: %v\nCalories: %v\nDietary Restrictions: %v\n",
						r.ID, r.Name, r.CookingMinutes, r.Method, r.Ingredients, r.ServingSize, 
						r.Calories, r.DietaryRestrictions)
}

func (u User) String() string {
	isPasswordPresent := "**NOT PRESENT**"
	if u.Password != "" {
		isPasswordPresent = "**PRESENT**"
	}
	return fmt.Sprintf("ID: %v\nUsername: %v\nPassword: %v\nAdmin: %v\n",
						u.ID, u.Username, isPasswordPresent, u.AdminStatus)
}

func (env DbEnv) MainSearch(parameters []string) ([]Recipe, error) {
	querySuffix := 
`WHERE c.ingredient_name SIMILAR TO $1  
OR a.recipe_name SIMILAR TO $1 
GROUP BY a.recipe_id`

	var sb strings.Builder
	fmt.Fprintf(&sb, "%v\n%v", recipeQueryPrefix, querySuffix)
	queryString := sb.String()

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
		
		err = rows.Scan(&recipe.ID, &recipe.Name, &recipe.CookingMinutes, 
						&recipe.Method, &recipe.Ingredients, &recipe.ServingSize, 
						&recipe.Calories, &recipe.DietaryRestrictions)
		if err != nil {
			return nil, err
		}

		recipes = append(recipes, recipe)
	}

	return recipes, nil
}

func (env DbEnv) SelectAccount(username string) (User, error) {
	queryString := "SELECT * FROM account WHERE account_username = $1"
	var user User
	
	row := env.DBpool.QueryRow(context.Background(), queryString, username)
	if err := row.Scan(&user.ID, &user.Username, &user.Password, &user.AdminStatus); err != nil {
		return User{}, err
	}

	return user, nil
}

func (env DbEnv) GetRecipeByID(id int) (*Recipe, error) {
	querySuffix := "WHERE a.recipe_id = $1 GROUP BY a.recipe_id"
	
	var sb strings.Builder
	fmt.Fprintf(&sb, "%v\n%v", recipeQueryPrefix, querySuffix)
	queryString := sb.String()

	var recipe *Recipe
	row := env.DBpool.QueryRow(context.Background(), queryString, id)
	err := row.Scan(&recipe.ID, &recipe.Name, &recipe.CookingMinutes, 
					&recipe.Method, &recipe.Ingredients, &recipe.ServingSize, 
					&recipe.Calories, &recipe.DietaryRestrictions)
	if err != nil {
		return nil, fmt.Errorf("could not retrieve recipe with id = %v: %v", id, err)
	}

	return recipe, nil
}

func (env DbEnv) CreateAccount(username, hash string) error {
	queryString := "INSERT INTO account (account_username, account_password) values($1, $2)"

	tag, err := env.DBpool.Exec(context.Background(), queryString, username, hash)
	if err != nil {
		return err
	}
	if !tag.Insert() {
		return fmt.Errorf("command tag did not start with 'INSERT': %v", tag)
	}
	return nil
}

func (env DbEnv) InsertAccountRecipe(accountID, recipeID int, scheduledTime string) error {
	queryString := "INSERT INTO account_recipe (account_id, recipe_id, scheduled_time) values($1, $2, $3)"

	tag, err := env.DBpool.Exec(context.Background(), queryString, accountID, recipeID, scheduledTime)
	if err != nil {
		return err
	}
	if !tag.Insert() {
		return fmt.Errorf("command tag did not start with 'INSERT': %v", tag)
	}
	return nil
}

func init() {
	recipeQueryPrefix = 
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
LEFT JOIN dietary_restrictions e on d.diet_restriction_id = e.diet_restriction_id `
}