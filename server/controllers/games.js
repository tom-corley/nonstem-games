const Games = require('../models/Games');

// POST /games/start
const startGame = async (req, res) => {
  try {
    const { user_id, category, num_questions } = req.body;
    const result = await Games.start(user_id, category, num_questions);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// PATCH /games/:game_id/submit
const submitResults = async (req, res) => {
  try {
    const game_id = parseInt(req.params.game_id);
    const { results } = req.body;
    const result = await Games.submitResults(game_id, results);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { startGame, submitResults };