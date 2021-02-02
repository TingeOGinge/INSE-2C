Feature: Container test

  Scenario: the db container is started 
    Given a docker config for the database
    When I start the environment
    Then the containers are running
    And afterwards the container is stopped