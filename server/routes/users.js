const { Router } = require('express');
const router = Router();
const usersController = require('../controllers/users');

router.get('/', usersController.index);
router.get('/:id', usersController.show);
router.post('/', usersController.create);
router.patch('/:id', usersController.update);
router.delete('/:id', usersController.destroy);

module.exports = router;