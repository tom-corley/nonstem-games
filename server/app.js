const express = require('express')
const cors = require('cors')

const questionsRoutes = require('./routes/questions')
const usersRoutes = require('./routes/users')
const gamesRoutes = require('./routes/games')
const logger = require('./middleware/logger')

const app = express()

app.use(express.json())
app.use(cors())
app.use(logger)

// Serve static files from the client directory
const path = require('path');
app.use(express.static(path.join(__dirname, '../client')));

app.use('/questions', questionsRoutes)
app.use('/users', usersRoutes)
app.use('/games', gamesRoutes)


module.exports = app