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
    category VARCHAR(100),  

    PRIMARY KEY (game_id, question_id)
);
INSERT INTO questions (
    category, difficulty, question_text, correct_answer, question_type,
    choice_a, choice_b, choice_c, choice_d
) VALUES 
('Geography', 2, 'What is the capital city of Australia?', 'Canberra', 'multiple_choice', 'Sydney', 'Melbourne', 'Canberra', 'Brisbane'),
('Geography', 2, 'Which country is known as the Land of the Rising Sun?', 'Japan', 'multiple_choice', 'China', 'Japan', 'South Korea', 'Thailand'),
('Geography', 2, 'What is the capital city of Canada?', 'Ottawa', 'multiple_choice', 'Toronto', 'Vancouver', 'Ottawa', 'Montreal'),
('Geography', 3, 'Which country has the most natural lakes?', 'Canada', 'multiple_choice', 'Russia', 'United States', 'Canada', 'Brazil'),
('Geography', 2, 'What is the capital city of Brazil?', 'Brasília', 'multiple_choice', 'Rio de Janeiro', 'São Paulo', 'Brasília', 'Salvador'),
('Geography', 1, 'Which country is home to the Eiffel Tower?', 'France', 'multiple_choice', 'Italy', 'France', 'Germany', 'Spain'),
('Geography', 1, 'What is the capital city of India?', 'New Delhi', 'multiple_choice', 'Mumbai', 'New Delhi', 'Kolkata', 'Bangalore'),
('Geography', 2, 'Which country is known for its pyramids and the Sphinx?', 'Egypt', 'multiple_choice', 'Mexico', 'Egypt', 'Greece', 'Turkey'),
('Geography', 2, 'What is the capital city of Italy?', 'Rome', 'multiple_choice', 'Venice', 'Rome', 'Florence', 'Milan'),
('Geography', 4, 'Which country is the largest by land area?', 'Russia', 'multiple_choice', 'United States', 'China', 'Russia', 'Canada'),
('Geography', 2, 'What is the capital city of Germany?', 'Berlin', 'multiple_choice', 'Munich', 'Berlin', 'Frankfurt', 'Hamburg'),
('Geography', 3, 'Which country is known for its maple syrup production?', 'Canada', 'multiple_choice', 'United States', 'Canada', 'Sweden', 'Norway'),
('Geography', 3, 'What is the capital city of South Africa?', 'Pretoria', 'multiple_choice', 'Cape Town', 'Pretoria', 'Johannesburg', 'Durban'),
('Geography', 3, 'Which country is home to the Great Wall?', 'China', 'multiple_choice', 'Japan', 'China', 'India', 'South Korea'),
('Geography', 2, 'What is the capital city of Spain?', 'Madrid', 'multiple_choice', 'Barcelona', 'Madrid', 'Seville', 'Valencia');
