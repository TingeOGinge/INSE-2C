package account

import (
	"encoding/json"
	"io"

	"github.com/TingeOGinge/inse2c/server/auth"
	"github.com/TingeOGinge/inse2c/server/database"
)

type AccEnv struct {
	DB interface{
		CreateAccount(string, string) (error)
		InsertAccountRecipe(accountID, recipeID int, scheduledTime string) error
	}
}

type ScheduleRecipeRequest struct {
	RecipeID int `json:"recipe_id"`
	Time string `json:"scheduled_time"`
}

func (env AccEnv) CreateUser(username, password string) error {
	hash, err := auth.HashPassword(password)
	if err != nil {
		return err
	}
	if err := env.DB.CreateAccount(username, string(hash)); err != nil {
		return err
	}
	return nil
}

func (env AccEnv) ScheduleRecipe(body io.ReadCloser, user *database.User) error {
	var scheduleRecipeReq ScheduleRecipeRequest
	err := json.NewDecoder(body).Decode(&scheduleRecipeReq)
	if err != nil {
		return err
	}

	err = env.DB.InsertAccountRecipe(*user.ID, scheduleRecipeReq.RecipeID, scheduleRecipeReq.Time)
	if err != nil {
		return err
	}

	return nil
}