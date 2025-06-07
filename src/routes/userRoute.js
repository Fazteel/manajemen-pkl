const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate, checkRole } = require('../middleware/authMiddleware')

router.get('/user/', authenticate, checkRole('admin'), userController.getAllUsers);
router.post('/user/users', authenticate, checkRole('admin'), userController.createUser);

module.exports = router;