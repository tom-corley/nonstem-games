const Questions = require('../models/Questions');

const index = async (req, res) => {
  try {
    const questions = await Questions.getAll();
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const show = async (req, res) => {
  try {
    const question = await Questions.findById(parseInt(req.params.id));
    res.status(200).json(question);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const create = async (req, res) => {
  try {
    const newQuestion = await Questions.create(req.body);
    res.status(201).json({ data: newQuestion });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const update = async (req, res) => {
  try {
    const question = await Questions.findById(parseInt(req.params.id));
    const updatedQuestion = await question.update(req.body);
    res.status(200).json(updatedQuestion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const destroy = async (req, res) => {
  try {
    const question = await Questions.findById(parseInt(req.params.id));
    await question.destroy();
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { index, show, create, update, destroy };
