const User = require('../models/users');

async function register(req, res) {
    try {
      // Extract fields and create user
      const { username, password } = req.body;
      const new_user = await User.create({
        username,
        password,
        is_admin: false
      });

      // Send user object, sanitised by model
      res.status(201).send(new_user);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
}

async function login(req, res) {
  try {
    const { username, password } = req.body
    result = await User.authenticate(username, password)
    res.status(200).send(result)
  } catch(err) {
    res.status(500).json({error: err.message})
  }
}


module.exports = {
    register, login
}                        