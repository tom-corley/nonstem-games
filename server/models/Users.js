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

}

module.exports = User;
