DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products
(
    item_id INT NOT NULL
    AUTO_INCREMENT,
product_name VARCHAR
    (100) NULL,
department_name VARCHAR
    (100) NULL,
price DECIMAL
    (8,2) NULL,
stock_quantity INT NULL,
PRIMARY KEY
    (item_id)
);

    INSERT INTO products
        (product_name, department_name, price, stock_quantity)
    VALUES
        ("Fender American Professional Telecaster", "electric guitars", 1499.99, 18),
        ("Fender American Elite Stratocaster HSS Shawbucker", "electric guitars", 1899.99, 12),
        ("Gibson Les Paul Standard HP-II", "electric guitars", 3699.00, 4),
        ("Black Diamond Super 8", "climbing/canyoneering", 15.95, 54),
        ("Petzl Pirana Canyon Descender", "climbing/canyoneering", 44.95, 43),
        ("Anova Sous Vide", "cookware", 159.00, 27),
        ("Volkl 2018 Race Tiger Speedwall GS", "skis", 1109.00, 18),
        ("Salomon QST 118 Skis", "skis", 749.95, 13),
        ("Convert 850DT 10 degree Bag", "backpacking/camping", 365, 31);


    SELECT *
    FROM products;