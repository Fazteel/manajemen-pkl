const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const {authenticate, checkRole} = require('../middleware/authMiddleware')

router.post('/auth/users', authenticate, checkRole('admin'), authController.createUser);
router.post('/auth/login', authController.login);
router.post('/auth/logout', authenticate, authController.logout);
router.post('/auth/set-password', authController.setPassword);
router.post('/auth/resend-set-password', authController.resendSetPassword );
router.post('/auth/forgot-password', authController.forgotPassword);
router.post('/auth/verify-otp', authController.verifyOTP);
router.post('/auth/reset-password', authController.resetPassword);

module.exports = router;