CREATE DATABASE IF NOT EXISTS Forms;

CREATE TABLE users(
    user_id INT SERIAL PRIMARY KEY,
    user_name VARCHAR(255) NOT NULL,
    user_password VARCHAR(255) NOT NULL,
    user_email VARCHAR(255) NOT NULL
);

INSERT INTO users(user_name, user_password, user_email) 
        VALUES('Firdavs', 'Firdavs786', 'firdavsokilov04@gmail.com');

ALTER TABLE users
ADD COLUMN role VARCHAR(10) DEFAULT 'admin';

CREATE TABLE templates (
    id PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    topic VARCHAR(50) NOT NULL, -- Example: 'Education', 'Job', etc.
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_favorite BOOLEAN DEFAULT FALSE
);

CREATE TABLE questions (
    id SERIAL PRIMARY KEY,
    template_id INT REFERENCES templates(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL, 
    content TEXT NOT NULL
);

CREATE TABLE answers (
    id SERIAL PRIMARY KEY,
    question_id INT REFERENCES questions(id) ON DELETE CASCADE,
    content TEXT NOT NULL
);

CREATE TABLE likes (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    template_id INT REFERENCES templates(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    template_id INT REFERENCES templates(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
