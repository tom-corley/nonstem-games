DROP TABLE IF EXISTS questions;

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