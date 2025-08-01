const fs = require('fs');
require("dotenv").config();

const db = require("./connect");

const createTablesSQL = fs.readFileSync('./database/create_tables.sql').toString();
const seedQuestionsSQL = fs.readFileSync('./database/seed_questions.sql').toString();

db.query(createTablesSQL)
    .then(() => db.query(seedQuestionsSQL))
    .then(() => console.log("Set-up and seeding complete."))
    .catch(error => console.log(error));