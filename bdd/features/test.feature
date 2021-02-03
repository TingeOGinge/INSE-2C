Feature: Container test

  Scenario Outline: check recipe by id 
    Given a live server
    When I call the api route "<route>"
    And I resolve the json response body
    Then the response body contains "<key1>" "<value1>"
    And the response body contains "<key2>" "<value2>"

  Examples:
  | route | key1 | value1 | key2 | value2 |
  | /api/getRecipe/10 | recipe_name | Chorizo carbonara | cooking_minutes | 15 |