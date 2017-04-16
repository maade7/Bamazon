CREATE database bamazon;

USE bamazon;

CREATE TABLE products (
  id INTEGER(11) AUTO_INCREMENT NOT NULL,
  product_name VARCHAR(100)  NOT NULL,
  department_name VARCHAR(100) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock_quantity INTEGER(10) NOT NULL,
  PRIMARY KEY (id)
);

ALTER TABLE bamazon.products ADD product_sales DECIMAL(10,2) NOT NULL;

USE bamazon;

CREATE TABLE departments (
  id INTEGER(11) AUTO_INCREMENT NOT NULL,
  department_name VARCHAR(100) NOT NULL,
  over_head_costs DECIMAL(10,2) NOT NULL,
  total_sales DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (id)
);