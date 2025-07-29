const { Router } = require('express');
const router = Router();
const usersController = require('../controllers/users');

router.get('/', usersController.register);
router.get('/:id', usersController.login);

module.exports = router;