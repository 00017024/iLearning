CREATE DATABASE IF NOT EXISTS Forms;

CREATE TABLE users(
    user_id INT SERIAL PRIMARY KEY,
    user_name VARCHAR(255) NOT NULL,
    user_password VARCHAR(255) NOT NULL,
    user_email VARCHAR(255) NOT NULL
);

INSERT INTO users(user_name, user_password, user_email) 
        VALUES('Firdavs', 'Firdavs786', 'firdavsokilov04@gmail.com');