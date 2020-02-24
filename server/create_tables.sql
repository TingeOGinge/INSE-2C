create database ecochefdb;
\c ecochefdb

create table ingredient (
ingredient_id serial primary key,
ingredient_name varchar(32) not null
);

create table recipe (
recipe_id serial primary key,
recipe_name varchar(32) not null,
recipe_cooking_time integer not null,
recipe_method text [] not null,
recipe_serving_size integer not null,
recipe_calories integer not null
);

create table recipe_ingredient (
primary key (recipe_id, ingredient_id),
recipe_id integer references recipe(recipe_id),
ingredient_id integer references ingredient(ingredient_id)
);

create table account (
account_id serial primary key,
account_username varchar(32) not null,
account_password varchar(100) not null,
constraint account_username unique
);

create table account_recipe (
primary key (account_id, recipe_id, scheduled_time),
account_id integer references account(account_id),
recipe_id integer references recipe(recipe_id),
scheduled_time timestamp not null
);
