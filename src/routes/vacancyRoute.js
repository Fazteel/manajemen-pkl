const express = require('express');
const router = express.Router();
const controller = require('../controllers/vacancyController');
const { authenticate, checkRole } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/vacancy/', controller.getAll);
router.post('/vacancy/', authenticate, checkRole('admin', 'guru'), upload.single('gambar') ,controller.create);
router.get('/vacancy/:id', controller.getOne);
router.put('/vacancy/:id', authenticate, checkRole('admin', 'guru'), upload.single('gambar'), controller.update);
router.delete('/vacancy/:id', authenticate, checkRole('admin', 'guru'), controller.remove);

module.exports = router;