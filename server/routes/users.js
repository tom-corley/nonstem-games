const { Router } = require('express');
const router = Router();
const authenticate = require('../middleware/auth')
const usersController = require('../controllers/users');

router.post('/register', usersController.register);
router.post('/login', usersController.login);
router.patch('/update', authenticate, usersController.update);
router.get('/:id', usersController.fetchUser);
router.delete('/delete', usersController.destroy)

module.exports = router;