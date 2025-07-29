const express = require('express')
const cors = require('cors')

const questionsRoutes = require('./routes/questions')
const usersRoutes = require('./routes/users')
const gamesRoutes = require('./routes/games')

const app = express()

app.use(express.json())
app.use(cors())

app.use('/questions', questionsRoutes)
app.use('/users', usersRoutes)
app.use('/games', gamesRoutes)


module.exports = app