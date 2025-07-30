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

    // Calculate percentage score (1-100)
    let percentage = Math.round((total_correct / results.length) * 100);

    // 2. Updating game record on games table
    const updated_game_res = await db.query(
      `UPDATE games SET correct_answers = $1, score = $2, ended_at = NOW() WHERE id = $3 RETURNING *`,
      [total_correct, percentage, game_id]
    );
    const updated_game = updated_game_res.rows[0];

    // Fetch user to get current high_score
    const userRes = await db.query(
      `SELECT high_score FROM users WHERE id = $1`,
      [updated_game.user_id]
    );
    const currentHigh = userRes.rows[0].high_score;
    let newHigh = currentHigh;
    if (percentage > currentHigh) {
      newHigh = percentage;
    }

    // 4. Updating user record on users table
    await db.query(
      `UPDATE users SET all_time_score=all_time_score+$1, games_played=games_played+1, high_score=$2 WHERE id = $3 RETURNING *`,
      [total_correct, newHigh, updated_game.user_id]
    );

    return new Games(updated_game);
  }

}

module.exports = Games