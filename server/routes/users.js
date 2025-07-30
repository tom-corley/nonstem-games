const { Router } = require('express');
const router = Router();
const authenticate = require('../middleware/auth')
const usersController = require('../controllers/users');

router.get('/results', authenticate, usersController.results)
router.get('/:id', usersController.fetchUser);
router.post('/register', usersController.register);
router.post('/login', usersController.login);
router.patch('/update', authenticate, usersController.update);
router.delete('/delete', authenticate, usersController.destroy)

module.exports = router;