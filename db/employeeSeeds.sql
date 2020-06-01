USE employees_db;

INSERT INTO departments(name) VALUES ("Human Resources");
INSERT INTO departments(name) VALUES ("Engineering");
INSERT INTO departments(name) VALUES ("Management");

INSERT INTO roles(title, salary, department_id) VALUES ("Front End Developer", 120000.00, 2);