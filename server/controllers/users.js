const Users = require('../models/Users');

const index = async (req, res) => {
  try {
    const users = await Users.getAll();
    res.status(200).json({ data: users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const show = async (req, res) => {
  try {
    const user = await Users.findById(parseInt(req.params.id));
    res.status(200).json({ data: user });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

const create = async (req, res) => {
  try {
    const newUser = await Users.create(req.body);
    res.status(201).json({ data: newUser });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const update = async (req, res) => {
  try {
    const user = await Users.findById(parseInt(req.params.id));
    const updatedUser = await user.update(req.body);
    res.status(200).json({ data: updatedUser });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const destroy = async (req, res) => {
  try {
    const user = await Users.findById(parseInt(req.params.id));
    await user.destroy();
    res.status(204).end();
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

module.exports = { index, show, create, update, destroy };
