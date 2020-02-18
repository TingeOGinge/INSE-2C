insert into ingredient (ingredient_id, ingredient_name)
values ('1', 'chickpeas');

insert into ingredient (ingredient_id, ingredient_name)
values ('2', 'lemon juice');

insert into ingredient (ingredient_id, ingredient_name)
values ('3', 'tahini');

insert into ingredient (ingredient_id, ingredient_name)
values ('4', 'onion');

insert into ingredient (ingredient_id, ingredient_name)
values ('5', 'red pepper');

insert into ingredient (ingredient_id, ingredient_name)
values ('6', 'chopped tomatoes');

insert into ingredient (ingredient_id, ingredient_name)
values ('7', 'gnocchi');

insert into ingredient (ingredient_id, ingredient_name)
values ('8', 'mozzarella');

insert into recipe (recipe_id, recipe_name, recipe_cooking_time, recipe_method, recipe_serving_size, recipe_calories)
values ('1', 'hummus', 5, 'add them all together and stir', 1, 500);

insert into recipe (recipe_id, recipe_name, recipe_cooking_time, recipe_method, recipe_serving_size, recipe_calories)
values ('2', 'gnocchi pastabake', 15, 'fry onion, simmer tomatoes & red pepper, boil gnocchi and add mozzarella', 1, 700);

insert into recipe_ingredient (recipe_id, ingredient_id)
values ('1', '1');

insert into recipe_ingredient (recipe_id, ingredient_id)
values ('1', '2');

insert into recipe_ingredient (recipe_id, ingredient_id)
values ('1', '3');

insert into recipe_ingredient (recipe_id, ingredient_id)
values ('2', '4');

insert into recipe_ingredient (recipe_id, ingredient_id)
values ('2', '5');

insert into recipe_ingredient (recipe_id, ingredient_id)
values ('2', '6');

insert into recipe_ingredient (recipe_id, ingredient_id)
values ('2', '7');

insert into recipe_ingredient (recipe_id, ingredient_id)
values ('2', '8');

insert into account (account_id, account_username, account_password)
values ('1', 'James', '$2b$10$DF9IeqREJ7/P8jwgFE2hWew6.WoEyIcQu2yODDTn0C9DOBl8CGN.C');

insert into account (account_id, account_username, account_password)
values ('2', 'Dillon', '$2b$10$RyP8UjJ41p/fg94RL3jl4uahSdHHjM0nWAIUp0xDSN9iN4yZQgIbq');

insert into account_recipe (account_id, recipe_id, scheduled_time)
values ('1', '2', '2020-03-01 12:00:00');

insert into account_recipe (account_id, recipe_id, scheduled_time)
values('2', '1', '2020-02-27 18:30:00');