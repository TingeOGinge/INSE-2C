Feature: Search tests

  Scenario Outline: GET recipe by id
    Given a live server
    When I GET the api route "<route>"
    And I resolve the json response body
    Then the response body contains "<key1>" "<value1>"
    And the response body contains "<key2>" "<value2>"

  Examples:
  | route | key1 | value1 | key2 | value2 |
  | /api/getRecipe/10 | recipe_name | Chorizo carbonara | cooking_minutes | 15 |
  | /api/getRecipe/15 | recipe_name | Quick tomato macaroni cheese | recipe_serving_size | 6 |
