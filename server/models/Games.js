const db = require('../database/connect');
const Questions = require('./Questions')

class Games {
  constructor(data) {
    this.id = data.id;
    this.user_id = data.user_id;
    this.category = data.category;
    this.total_questions = data.total_questions;
    this.score = data.score;
    this.started_at = data.started_at;
    this.ended_at = data.ended_at;
    this.correct_answers = data.correct_answers;
  }

  // Model function for creating a new game.
  static async start(user_id, category, num_questions) {
    // 1. Select required amount of questions from questions table
    const quiz_questions = await db.query(
      `SELECT * FROM questions WHERE category = $1 AND is_active = TRUE ORDER BY RANDOM() LIMIT $2`,
      [category, num_questions]
    );
    if (quiz_questions.rows.length < num_questions) throw new Error('Not enough questions found for this category');

    // 2. Create a game record in the database
    const create_res = await db.query(
      `INSERT INTO games (user_id, category, total_questions, started_at) VALUES ($1, $2, $3, NOW()) RETURNING *`,
      [user_id, category, quiz_questions.rows.length]
    );
    const new_game = new Games(create_res.rows[0]);

    // 3. Create game_questions records for each question in the game
    const gameQuestions = [];
    for (let i = 0; i < quiz_questions.rows.length; i++) {
      const q = quiz_questions.rows[i];
      await db.query(
        `INSERT INTO game_questions (game_id, question_id, question_order, category) VALUES ($1, $2, $3, $4) RETURNING *`,
        [new_game.id, q.id, i + 1, q.category]
      );
      gameQuestions.push(new Questions(q))
    }

    // 4. Return game object and game_questions objects
    return { game: new_game, game_questions: gameQuestions};
  }

  // Updating database with results of a game, passed in an array of game_questions objects in order, and a game_id
  static async submitResults(game_id, results) {
    // 1. Updating each game_questions record based on correctness, incrementing score if correct
    let total_correct = 0;
    for (const r of results) {
      await db.query(
        `UPDATE game_questions SET was_correct = $1 WHERE game_id = $2 AND question_id = $3`,
        [r.was_correct, game_id, r.question_id]
      );
      if (r.was_correct) total_correct++;
    }

    // 2. Updating game record on games table
    const updated_game = await db.query(
      `UPDATE games SET correct_answers = $1, score = $1, ended_at = NOW() WHERE id = $2 RETURNING *`,
      [total_correct, game_id]
    );
    return new Games(updated_game.rows[0]);
  }

}

module.exports = Games