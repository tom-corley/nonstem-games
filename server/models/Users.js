const db = require('../database/connect');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

class User {

    constructor(data) {
        this.id = data.id;
        this.username = data.username;
        this.password_hash = data.password_hash;
        this.join_date = data.join_date;
        this.all_time_score = data.all_time_score
        this.games_played = data.games_played
        this.high_score = data.high_score
        this.is_admin = data.is_admin;
    }

    sanitised() {
        const {password_hash, ...safeData } = this;
        return safeData;
    }

    static async getOneById(id) {
        const response = await db.query("SELECT * FROM users WHERE id = $1", [id]);
        if (response.rows.length !== 1) {
            throw new Error("Unable to locate user.");
        }
        return new User(response.rows[0]);
    }

    static async cleanGetOneById(id) {
        return (await User.getOneById(id)).sanitised()
    }

    static async getUserResults(id) {
        // 1. Fetch all games for the user from games table
        const gamesRes = await db.query(
            'SELECT * FROM games WHERE user_id = $1 ORDER BY started_at DESC',
            [id]
        );
        const games = gamesRes.rows;

        // 2. For each game, fetch game_questions and flatten question fields
        const results = [];
        for (const game of games) {
            // Fetch game_questions for this game
            const games_questions = await db.query(
                'SELECT * FROM game_questions WHERE game_id = $1 ORDER BY question_order',
                [game.id]
            );

            // Create questions object which aggregates data from game_questions and questions
            const questions = [];
            for (const gq of games_questions.rows) {
                // Fetch question from questions table
                const qRes = await db.query(
                    'SELECT id, category, difficulty, question_text, correct_answer, question_type, choice_a, choice_b, choice_c, choice_d, image_url FROM questions WHERE id = $1',
                    [gq.question_id]
                );
                const q = qRes.rows[0] || {};

                // Create object for each question
                questions.push({
                    question_id: gq.question_id,
                    was_correct: gq.was_correct,
                    question_order: gq.question_order,
                    // flatten question fields
                    category: q.category,
                    difficulty: q.difficulty,
                    question_text: q.question_text,
                    correct_answer: q.correct_answer,
                    question_type: q.question_type,
                    choice_a: q.choice_a,
                    choice_b: q.choice_b,
                    choice_c: q.choice_c,
                    choice_d: q.choice_d,
                    image_url: q.image_url
                });
            }
            results.push({
                id: game.id,
                started_at: game.started_at,
                ended_at: game.ended_at,
                category: game.category,
                total_questions: game.total_questions,
                score: game.score,
                correct_answers: game.correct_answers,
                questions
            });
        }
        return results;
    }

    static async getOneByUsername(username) {
        const response = await db.query("SELECT * FROM users WHERE username = $1", [username]);
        if (response.rows.length !== 1) {
            throw new Error("Unable to locate user.");
        }
        return new User(response.rows[0]);
    }

    static async authenticate(username, password) {
        // Fetch user
        const user = await User.getOneByUsername(username)
        if(!user) { throw new Error('No user with this username') }

        // Compare passwords
        const match = await bcrypt.compare(password, user.password_hash)
        if (!match) {throw new Error('Incorrect Password')}

        // Create token payload and sign token
        const payload = {
            id: user.id,
            username: user.username,
            is_admin: user.is_admin
        }
        const token = jwt.sign(
            payload,
            process.env.SECRET_TOKEN,
            { expiresIn: '1h'}
        )

        // Return token and safe user data
        return {
            token,
            user: user.sanitised()
        }
    }


    static async create(data) {
        // Unpack object and encrypt password
        const { username, password, is_admin } = data;
        const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_SALT_ROUNDS));
        const password_hash = await bcrypt.hash(password, salt);

        // Add user to database
        const response = await db.query(
            `INSERT INTO users (username, password_hash, is_admin) VALUES ($1, $2, $3) RETURNING *`,
            [username, password_hash, is_admin]
        );


        return new User(response.rows[0]).sanitised();
    }

    static async updateUsername(id, newUsername) {
        const response = await db.query(
            'UPDATE users SET username = $1 WHERE id = $2 RETURNING *',
            [newUsername, id]
        );
        if (response.rows.length === 0) throw new Error('User not found');
        return new User(response.rows[0]).sanitised();
    }

    static async deleteUser(user_id) {
        const response = await db.query(
            'DELETE FROM users WHERE id = $1 RETURNING *',
            [user_id]
        )
        if (response.rows.length === 0) throw new Error('User not found')
        return {message: "User deleted successfully."}
    }

}

module.exports = User;
