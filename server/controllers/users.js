const User = require('../models/users');

// POST /users/register
async function register(req, res) {
  try {
    // Extract fields and create user
    const { username, password } = req.body;
    const new_user = await User.create({
      username,
      password,
      is_admin: false,
    });

    // Send user object, sanitised by model
    res.status(201).send(new_user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// POST /users/login
async function login(req, res) {
  try {
    const { username, password } = req.body;
    result = await User.authenticate(username, password);
    res.status(200).send(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// GET /users/:id
async function fetchUser(req, res) {
  try {
    const username = req.params.id;
    if (!username) throw new Error('Error passing in user_id');
    const user = await User.cleanGetOneById(username);
    res.status(200).send(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// PATCH /users/update
async function update(req, res) {
  try {
    const {username: newUsername } = req.body
    const userId = req.user.id
    const updatedUser = await User.updateUsername(userId, newUsername)
    res.status(200).send(updatedUser)
  } catch(err) {
    res.status(500).json({error: err.message})
  }
}

// DELETE /users/delete
async function destroy(req, res) {
  try {
    const userId = req.user.id
    const result = await User.deleteUser(userId)
    res.status(204).send(result)
  } catch(err) {
    res.status(500).json({error: err.message})
  }
}

// GET /users/results
async function results(req, res) {
  try {
    const userId = req.user.id
    const result = await User.getUserResults(userId)
    res.status(200).send(result)
  } catch(err) {
    res.status(500).json({error: err.message})
  }
}

module.exports = {
    register, login, fetchUser, update, destroy, results
}
