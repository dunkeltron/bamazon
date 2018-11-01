DROP DATABASE IF EXISTS productsDB;

CREATE DATABASE productsDB;

USE productsDB;

CREATE TABLE products (
    item_id INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(45) NOT NULL,
    department_name VARCHAR(45) NOT NULL,
    price INT(10) NOT NULL,
    stock_quantity INT(4) NOT NULL,
    primary key(item_id)
);

INSERT INTO products (product_name,department_name,price,stock_quantity)
VALUES ('Socks', 'Clothing', 10, 5);

INSERT INTO products (product_name,department_name,price,stock_quantity)
VALUES ('HDMI Cable', 'Electronics', 10, 2);

INSERT INTO products (product_name,department_name,price,stock_quantity)
VALUES ("Dinosaur Phone Holder", "Home & Office", 5, 500);

INSERT INTO products (product_name,department_name,price,stock_quantity)
VALUES ("Coffee Beans", "Grocery", 6, 25);

INSERT INTO products (product_name,department_name,price,stock_quantity)
VALUES ("Blender", "Kitchen", 50, 6);

INSERT INTO products (product_name,department_name,price,stock_quantity)
VALUES ("Smoke Alarm", "Home & Office", 23, 60);

INSERT INTO products (product_name,department_name,price,stock_quantity)
VALUES ("Dog Leash", "Pet Supplies", 11, 16);

INSERT INTO products (product_name,department_name,price,stock_quantity)
VALUES ("Oil Filter", "Automotive", 6, 16);

INSERT INTO products (product_name,department_name,price,stock_quantity)
VALUES ("Led Desk Lamp", "Home & Office", 30, 3);

INSERT INTO products (product_name,department_name,price,stock_quantity)
VALUES ("Dinner Fork Set. (12 Pieces)", "Kitchen", 13, 6);


