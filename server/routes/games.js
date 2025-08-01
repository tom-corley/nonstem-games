const { Router } = require('express');
const router = Router();
const authenticate = require('../middleware/auth')
const gamesController = require('../controllers/games');

router.use(authenticate)

// Start a new game
router.post('/start', gamesController.startGame);

// Submit results for a game
router.patch('/:game_id/submit', gamesController.submitResults);

module.exports = router;