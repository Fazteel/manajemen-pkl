const attendanceService = require("../services/attendanceService");

exports.generateQr = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await attendanceService.generateQr(userId);
    res.status(200).json({
      error: false,
      message: "QR Code berhasil dibuat",
      data: result,
    });
  } catch (err) {
    res.status(400).json({
      error: true,
      message: err.message,
    });
  }
};

exports.checkIn = async (req, res) => {
  try {
    const userId = req.user.id;
    const { qrData, location = {} } = req.body;
    const result = await attendanceService.checkIn(userId, qrData, location);
    res.status(200).json({
      error: false,
      message: "Check-in berhasil",
      data: result,
    });
  } catch (err) {
    res.status(400).json({
      error: true,
      message: err.message,
    });
  }
};

exports.checkOut = async (req, res) => {
  try {
    const userId = req.user.id;
    const { qrData, location = {} } = req.body;
    console.log(req.body);
    const result = await attendanceService.checkOut(userId, qrData, location);
    res.status(200).json({
      error: false,
      message: "Check-out berhasil",
      data: result,
    });
  } catch (err) {
    res.status(400).json({
      error: true,
      message: err.message,
    });
  }
};

exports.getMyAttendance = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await attendanceService.getAttendanceByUserId(userId);
    res.status(200).json({ error: false, data: result });
  } catch (err) {
    res.status(400).json({ error: true, message: err.message });
  }
};

exports.getAllAttendance = async (req, res) => {
  try {
    const result = await attendanceService.getAllAttendance();
    res.status(200).json({ error: false, data: result });
  } catch (err) {
    res.status(400).json({ error: true, message: err.message });
  }
};

exports.getAttendanceByUserId = async (req, res) => {
  try {
    const userId = req.params.id;
    const result = await attendanceService.getAttendanceByUserId(userId);
    res.status(200).json({ error: false, data: result });
  } catch (err) {
    res.status(400).json({ error: true, message: err.message });
  }
};

exports.permit = async (req, res) => {
  try {
    const userId = req.user.id;
    const { keterangan, alasan } = req.body;

    const result = await attendanceService.permit(userId, keterangan, alasan);
    res.status(200).json({
      error: false,
      message: "Pengajuan izin berhasil dicatat",
      data: result,
    });
  } catch (err) {
    res.status(400).json({ error: true, message: err.message });
  }
};

exports.absence = async (req, res) => {
  try {
    const result = await attendanceService.absence();
    res.status(200).json({
      error: false,
      message: "Alpha berhasil ditandai untuk user yang tidak absen & tidak izin",
      data: result,
    });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
};
