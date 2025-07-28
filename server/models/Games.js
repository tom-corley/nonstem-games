const db = require('../database/connect');

class Games {
  constructor(data) {
    this.id = data.id;
    this.category = data.category;
    this.difficulty = data.difficulty;
    this.question_text = data.question_text;
    this.correct_answer = data.correct_answer;
    this.question_type = data.question_type;
    this.is_active = data.is_active;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
    this.choice_a = data.choice_a;
    this.choice_b = data.choice_b;
    this.choice_c = data.choice_c;
    this.choice_d = data.choice_d;
    this.image_url = data.image_url;
  }

  static async getAll() {
    const result = await db.query('SELECT * FROM questions');
    return result.rows.map(q => new Questions(q));
  }

  static async findById(id) {
    const result = await db.query('SELECT * FROM questions WHERE id = $1', [id]);
    if (result.rows.length === 0) throw new Error('Question not found');
    return new Questions(result.rows[0]);
  }
}

module.exports = Games