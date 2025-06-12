const express = require('express');
const router = express.Router();
const controller = require('../controllers/vacancyController');
const { authenticate, checkRole } = require('../middleware/authMiddleware');

router.get('/vacancy/', controller.getAll);
router.post('/vacancy/', authenticate, checkRole('admin', 'guru'), controller.create);
router.get('/vacancy/:id', controller.getOne);
router.put('/vacancy/:id', authenticate, checkRole('admin'), controller.update);
router.delete('/vacancy/:id', authenticate, checkRole('admin'), controller.remove);

module.exports = router;