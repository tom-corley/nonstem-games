const { Router } = require('express');
const router = Router();
const usersController = require('../controllers/users');

router.post('/register', usersController.register);
router.post('/login', usersController.login);

module.exports = router;