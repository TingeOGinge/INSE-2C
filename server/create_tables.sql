

create table ingredient (
ingredient_id varchar(8) primary key,
ingredient_name varchar(32) not null
);

create table recipe (
recipe_id varchar(8) primary key,
recipe_name varchar(32) not null,
recipe_cooking_time integer not null,
recipe_method text not null,
recipe_serving_size integer not null,
recipe_carlories integer not null
);

create table recipe_ingredient (
primary key (recipe_id, ingredient_id),
recipe_id varchar(8) references recipe(recipe_id),
ingredient_id varchar(8) references ingredient(ingredient_id)
);

create table account (
account_id varchar(8) primary key,
account_username varchar(32) not null,
account_password varchar(100) not null
);

create table account_recipe (
primary key (account_id, recipe_id),
account_id varchar(8) references account(account_id),
recipe_id varchar(8) references recipe(recipe_id),
scheduled_time timestamp not null 
);

