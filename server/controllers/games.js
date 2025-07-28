const Games = require('../models/Games');

const newGame = async (req, res) => {
  try {
    const newQuestion = await Questions.create(req.body);
    res.status(201).json({ data: newQuestion });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const saveResults = async (req, res) => {
  try {
    const question = await Questions.findById(parseInt(req.params.id));
    const updatedQuestion = await question.update(req.body);
    res.status(200).json(updatedQuestion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};