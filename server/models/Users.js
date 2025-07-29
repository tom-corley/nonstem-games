const db = require('../database/connect');
const bcrypt = require('bcrypt')

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

    static async getOneById(id) {
        const response = await db.query("SELECT * FROM user_account WHERE user_id = $1", [id]);
        if (response.rows.length != 1) {
            throw new Error("Unable to locate user.");
        }
        return new User(response.rows[0]);
    }

    static async getOneByUsername(username) {
        const response = await db.query("SELECT * FROM user_account WHERE username = $1", [username]);
        if (response.rows.length != 1) {
            throw new Error("Unable to locate user.");
        }
        return new User(response.rows[0]);
    }

    static async create(data) {
        const { username, password_hash, isAdmin } = data;
        let response = await db.query(
            `INSERT INTO users (username, password_hash, is_admin) VALUES ($1, $2, $3) RETURNING user_id`,
            [username, password_hash, isAdmin]
        )
    }

}

module.exports = User;
