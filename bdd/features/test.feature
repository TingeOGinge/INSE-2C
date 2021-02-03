Feature: Container test

  Scenario Outline: check recipe by id 
    Given a live server
    When I call the api route "<route>"
    Then the response body contains "<key>" "<value>"

  Examples:
  | route | key | value |
  | /api/getRecipe/10 | recipe_name | Chorizo carbonara |
