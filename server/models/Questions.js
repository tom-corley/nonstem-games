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

  static async getQuizQuestions(category, num_of_res) {
    const result = await db.query('SELECT * FROM questions where category = $1 LIMIT $2', [category, num_of_res])
    return results.rows.map(q => new Questions(q));
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
    // Selectively include the fields which are passed in the body
    const fields = [];
    const vals = [];
    let param_num = 1

    for (const [key,value] of Object.entries(data)) {
        // Make sure it is an allowed field
        if ([
            "category", "difficulty", "question_text", "correct_answer",
            "question_type", "is_active", "choice_a", "choice_b",
            "choice_c", "choice_d", "image_url"
        ].includes(key)) {
            // Push name and value to build query later
            fields.push(`${key} = $${param_num}`);
            vals.push(value);
            param_num++;
        }
    }
    fields.push(`updated_at = NOW()`)
    vals.push(this.id);


    // Create query and values
    const query = `
        UPDATE questions
        SET ${fields.join(", ")}
        WHERE id = $${param_num}
        RETURNING *
    `;

    // Execute query
    const result = await db.query(query, vals);

    // Return result
    return new Questions(result.rows[0]);
  }

  async destroy() {
    await db.query('DELETE FROM questions WHERE id = $1', [this.id]);
    return true;
  }
}

module.exports = Questions;
