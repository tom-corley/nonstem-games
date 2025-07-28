-- Drop tables in backwards dependency order
DROP TABLE IF EXISTS game_questions;
DROP TABLE IF EXISTS games;
DROP TABLE IF EXISTS questions;
DROP TABLE IF EXISTS users;

-- create users table
CREATE TABLE users (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    join_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    all_time_score INTEGER DEFAULT 0,
    games_played INTEGER DEFAULT 0,
    high_score INTEGER DEFAULT 0,

    is_admin BOOLEAN DEFAULT FALSE
);

-- create questions table
CREATE TABLE questions (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    category VARCHAR(100),
    difficulty INTEGER CHECK (difficulty BETWEEN 1 AND 5),
    question_text VARCHAR(300) NOT NULL,
    correct_answer VARCHAR(300) NOT NULL,  

    question_type VARCHAR(50) DEFAULT 'short_answer',  -- 'multiple_choice' or 'short_answer'
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT NULL,

    choice_a VARCHAR(300) DEFAULT NULL,
    choice_b VARCHAR(300) DEFAULT NULL,
    choice_c VARCHAR(300) DEFAULT NULL,
    choice_d VARCHAR(300) DEFAULT NULL,

    image_url TEXT DEFAULT NULL
);

-- create games table
CREATE TABLE games (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    score INTEGER DEFAULT 0,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMP,
    
    total_questions INTEGER,
    correct_answers INTEGER,
    category VARCHAR(100)  -- Category of the game (e.g., Science, History)
);

-- create games and questions join table
CREATE TABLE game_questions (
    game_id INTEGER NOT NULL REFERENCES games(id) ON DELETE CASCADE,
    question_id INTEGER NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    question_order INTEGER,
    was_correct BOOLEAN,
    category VARCHAR(100),  -- Category at time of play (can be redundant but useful for audit/history)

    PRIMARY KEY (game_id, question_id)
);