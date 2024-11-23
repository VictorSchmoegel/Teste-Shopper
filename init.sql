CREATE DATABASE IF NOT EXISTS rides;

USE rides;

-- Tabela de motoristas
CREATE TABLE IF NOT EXISTS drivers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    vehicle VARCHAR(255) NOT NULL,
    review DECIMAL(10, 2) NOT NULL,
    tax DECIMAL(10, 2) NOT NULL,
    min_km FLOAT NOT NULL,
    max_km FLOAT NOT NULL
);

-- Tabela de viagens
CREATE TABLE IF NOT EXISTS rides (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    data DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    origin VARCHAR(255) NOT NULL,
    destination VARCHAR(255) NOT NULL,
    distance FLOAT NOT NULL,
    duration FLOAT NOT NULL,
    driver_id INT NOT NULL,
    driver_name VARCHAR(255) NOT NULL,
    value DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (driver_id) REFERENCES drivers (id)
);

-- Inserir motoristas
INSERT INTO
    drivers (
        name,
        description,
        vehicle,
        review,
        tax,
        min_km,
        max_km
    )
VALUES (
        'Homer Simpson',
        'Olá! Sou o Homer, seu motorista camarada! Relaxe e aproveite o passeio, com direito a rosquinhas e boas risadas (e talvez alguns desvios).',
        'Plymouth Valiant 1973 rosa e enferrujado',
        2.00,
        2.50,
        1,
        3
    ),
    (
        'Dominic Toretto',
        'Ei, aqui é o Dom. Pode entrar, vou te levar com segurança e rapidez ao seu destino. Só não mexa no rádio, a playlist é sagrada.',
        'Dodge Charger R/T 1970 modificado',
        4.00,
        5.00,
        5,
        5
    ),
    (
        'James Bond',
        'Boa noite, sou James Bond. À seu dispor para um passeio suave e discreto. Aperte o cinto e aproveite a viagem.',
        'Aston Martin DB5 clássico',
        5.00,
        10.00,
        10,
        10
    );