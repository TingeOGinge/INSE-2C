create database ecochefdb;
create user myuser with encrypted password 'inse2c';
\c ecochefdb
grant all privileges on all tables in schema public to myuser;
grant usage, select on all sequences in schema public to myuser;


create table ingredient (
ingredient_id serial primary key,
ingredient_name varchar(256) UNIQUE not null
);

create table recipe (
recipe_id serial primary key,
recipe_name varchar(256) UNIQUE not null,
recipe_cooking_time interval not null,
recipe_method text [] not null,
recipe_ingredients text [] not null,
recipe_serving_size integer not null,
recipe_calories integer not null
);

create table recipe_ingredient (
primary key (recipe_id, ingredient_id),
recipe_id integer references recipe(recipe_id) ON DELETE CASCADE,
ingredient_id integer references ingredient(ingredient_id) ON DELETE CASCADE
);

create table account (
account_id serial primary key,
account_username varchar(32) not null,
account_password varchar(100) not null,
admin_status boolean DEFAULT false not null,
UNIQUE(account_username)
);

create table account_recipe (
primary key (account_id, recipe_id, scheduled_time),
account_id integer references account(account_id) ON DELETE CASCADE,
recipe_id integer references recipe(recipe_id) ON DELETE CASCADE,
scheduled_time timestamp not null
);

create table dietary_restrictions (
  diet_restriction_id serial primary key,
  diet_restriction_name varchar(50) not null
);

create table recipe_dietary (
  primary key (recipe_id, diet_restriction_id),
  recipe_id integer references recipe(recipe_id) ON DELETE CASCADE,
  diet_restriction_id integer references dietary_restrictions(diet_restriction_id) ON DELETE CASCADE
);
