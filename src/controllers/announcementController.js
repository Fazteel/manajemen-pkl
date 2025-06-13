const announcementService = require('../services/announcementService');

exports.getAll = async (req, res) => {
  try {
    const announcements = await announcementService.getAll();
    res.status(200).json({
      error: false,
      message: "Pengumuman berhasil diambil",
      data: announcements
    });
  } catch (err) {
    res.status(500).json({
      error: true,
      message: "Terjadi kesalahan pada server",
      data: null
    });
  }
};

exports.getOne = async (req, res) => {
  try {
    const announcement = await announcementService.getOne(req.params.id);
    res.status(200).json({
      error: false,
      message: "Pengumuman berhasil diambil",
      data: announcement
    });
  } catch (err) {
    const statusCode = err.message.includes("tidak ditemukan") ? 404 : 500;
    res.status(statusCode).json({
      error: true,
      message: err.message,
      data: null
    });
  }
};

exports.create = async (req, res) => {
  try {
    const newAnnouncement = await announcementService.create(req.body);
    res.status(201).json({
      error: false,
      message: "Pengumuman berhasil dibuat",
      data: newAnnouncement
    });
  } catch (err) {
    const statusCode = err.message.includes("wajib diisi") ? 400 : 500;
    res.status(statusCode).json({
      error: true,
      message: err.message,
      data: null
    });
  }
};

exports.update = async (req, res) => {
  try {
    const updatedAnnouncement = await announcementService.update(req.params.id, req.body);
    res.status(200).json({
      error: false,
      message: "Pengumuman berhasil diperbarui",
      data: updatedAnnouncement
    });
  } catch (err) {
    const statusCode = err.message.includes("tidak ditemukan") ? 404 : 500;
    res.status(statusCode).json({
      error: true,
      message: err.message,
      data: null
    });
  }
};

exports.remove = async (req, res) => {
  try {
    await announcementService.remove(req.params.id);
    res.status(200).json({
      error: false,
      message: "Pengumuman berhasil dihapus",
      data: null
    });
  } catch (err) {
    const statusCode = err.message.includes("tidak ditemukan") ? 404 : 500;
    res.status(statusCode).json({
      error: true,
      message: err.message,
      data: null
    });
  }
};