const express = require('express');
const router = express.Router();
const announcementController = require('../controllers/announcementController');
const { authenticate, checkRole } = require('../middleware/authMiddleware');

router.get('/announcements', announcementController.getAll);
router.get('/announcements/:id', announcementController.getOne);
router.post('/announcements', authenticate, checkRole('admin', 'guru'), announcementController.create);
router.put('/announcements/:id', authenticate, checkRole('admin', 'guru'), announcementController.update);
router.delete('/announcements/:id', authenticate, checkRole('admin', 'guru'), announcementController.remove);

module.exports = router;