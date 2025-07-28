const db = require('../database/connect');

class Users {
  constructor(data) {
    this.id = data.id;
    this.username = data.username;
    this.password_hash = data.password_hash;
    this.join_date = data.join_date;
    this.all_time_score = data.all_time_score;
    this.games_played = data.games_played;
    this.high_score = data.high_score;
    this.is_admin = data.is_admin;
  }

  static async getAll() {
    const result = await db.query('SELECT * FROM users');
    return result.rows.map(u => new Users(u));
  }

  static async findById(id) {
    const result = await db.query('SELECT * FROM users WHERE id = $1', [id]);
    if (result.rows.length === 0) throw new Error('User not found');
    return new Users(result.rows[0]);
  }

  static async create(data) {
    const result = await db.query(
      `INSERT INTO users (username, password_hash, all_time_score, games_played, high_score, is_admin)
      VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [data.username, data.password_hash, data.all_time_score || 0, data.games_played || 0, data.high_score || 0, data.is_admin || false]
    );
    return new Users(result.rows[0]);
  }

  async update(data) {
    const result = await db.query(
      `UPDATE users SET username=$1, password_hash=$2, all_time_score=$3, games_played=$4, high_score=$5, is_admin=$6 WHERE id=$7 RETURNING *`,
      [data.username, data.password_hash, data.all_time_score, data.games_played, data.high_score, data.is_admin, this.id]
    );
    return new Users(result.rows[0]);
  }

  async destroy() {
    await db.query('DELETE FROM users WHERE id = $1', [this.id]);
    return true;
  }
}

module.exports = Users;
