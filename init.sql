CREATE DATABASE IF NOT EXISTS rides;

USE rides;

CREATE TABLE IF NOT EXISTS drivers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    min_km FLOAT NOT NULL,
    max_km FLOAT NOT NULL
);

CREATE TABLE IF NOT EXISTS rides (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    origin VARCHAR(255) NOT NULL,
    destination VARCHAR(255) NOT NULL,
    distance FLOAT NOT NULL,
    duration FLOAT NOT NULL,
    driver_id INT NOT NULL,
    driver_name VARCHAR(255) NOT NULL,
    value DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (driver_id) REFERENCES drivers (id)
);