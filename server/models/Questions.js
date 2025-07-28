const db = require('../database/connect');

class Questions {
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

  static async create(data) {
    const result = await db.query(
      `INSERT INTO questions (category, difficulty, question_text, correct_answer, question_type, is_active, choice_a, choice_b, choice_c, choice_d, image_url)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
      [data.category, data.difficulty, data.question_text, data.correct_answer, data.question_type, data.is_active, data.choice_a, data.choice_b, data.choice_c, data.choice_d, data.image_url]
    );
    return new Questions(result.rows[0]);
  }

  async update(data) {
    const result = await db.query(
      `UPDATE questions SET category=$1, difficulty=$2, question_text=$3, correct_answer=$4, question_type=$5, is_active=$6, choice_a=$7, choice_b=$8, choice_c=$9, choice_d=$10, image_url=$11, updated_at=NOW() WHERE id=$12 RETURNING *`,
      [data.category, data.difficulty, data.question_text, data.correct_answer, data.question_type, data.is_active, data.choice_a, data.choice_b, data.choice_c, data.choice_d, data.image_url, this.id]
    );
    return new Questions(result.rows[0]);
  }

  async destroy() {
    await db.query('DELETE FROM questions WHERE id = $1', [this.id]);
    return true;
  }
}

module.exports = Questions;
