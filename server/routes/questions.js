const { Router } = require('express');
const router = Router();
const questionsController = require('../controllers/questions');

router.get('/', questionsController.index);
router.get('/:id', questionsController.show);
router.post('/', questionsController.create);
router.patch('/:id', questionsController.update);
router.delete('/:id', questionsController.destroy);

module.exports = router;