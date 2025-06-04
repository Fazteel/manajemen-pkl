const express = require('express');
const router = express.Router();
const submissionController = require('../controllers/submissionController');
const { authenticate, checkRole } = require('../middleware/authMiddleware');

router.post('/submission/', authenticate, checkRole('siswa'), submissionController.create);
router.get('/submission/me', authenticate, submissionController.getMe);
router.get('/submission/', authenticate, submissionController.getAll);
router.put('/submission/:id', authenticate, checkRole('guru'), submissionController.approve);
router.delete('/submission/:id', authenticate, checkRole('siswa'), submissionController.cancel);

module.exports = router;