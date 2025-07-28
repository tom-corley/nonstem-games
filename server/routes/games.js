const { Router } = require('express');
const router = Router();
const gamesController = require('../controllers/games');

router.get(`/`, gamesController.newGame)
router.patch('/:id', questionsController.saveResults);

module.exports = router;