const express = require("express");
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const {authenticate, checkRole} = require('../middleware/authMiddleware')

router.post("/attendance/generate-qr", authenticate, checkRole('admin'), attendanceController.generateQr);
router.get("/attendance/", authenticate, checkRole('admin'), attendanceController.getAllAttendance);
router.get("/attendance/me", authenticate, attendanceController.getMyAttendance);
router.get("/attendance/user/:id", authenticate, checkRole('admin'), attendanceController.getAttendanceByUserId);
router.post("/attendance/check_in", authenticate, attendanceController.checkIn);
router.post("/attendance/check_out", authenticate, attendanceController.checkOut);
router.post("/attendance/permit", authenticate, attendanceController.permit);
router.post("/attendance/absence", authenticate, attendanceController.absence);

module.exports = router;
