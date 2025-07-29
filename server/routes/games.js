const { Router } = require('express');
const router = Router();
const gamesController = require('../controllers/games');


// Start a new game
router.post('/start', gamesController.startGame);

// Submit results for a game
router.patch('/:game_id/submit', gamesController.submitResults);

module.exports = router;