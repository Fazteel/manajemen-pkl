const submissionService = require('../services/submissionService');

exports.create = async (req, res) => {
  try {
    const result = await submissionService.create(req.user.id, req.body.lowongan_id);
    res.status(201).json({
      error: false,
      status: 201,
      message: "Created - Pengajuan berhasil dibuat",
      data: result
    });
  } catch (err) {
    res.status(400).json({
      error: true,
      status: 400,
      message: "Bad Request - " + err.message,
      data: null
    });
  }
};

exports.getMe = async (req, res) => {
  try {
    const result = await submissionService.getMe(req.user.id);
    res.status(200).json({
      error: false,
      status: 200,
      message: "OK - Data pengajuan siswa ditemukan",
      data: result
    });
  } catch (err) {
    res.status(500).json({
      error: true,
      status: 500,
      message: "Internal Server Error - " + err.message,
      data: null
    });
  }
};

exports.getAll = async (req, res) => {
  try {
    const result = await submissionService.getAll();
    res.status(200).json({
      error: false,
      status: 200,
      message: "OK - Seluruh data pengajuan berhasil diambil",
      data: result
    });
  } catch (err) {
    res.status(500).json({
      error: true,
      status: 500,
      message: "Internal Server Error - " + err.message,
      data: null
    });
  }
};

exports.approve = async (req, res) => {
  try {
    const result = await submissionService.approve(req.params.id, req.body.status);
    res.status(200).json({
      error: false,
      status: 200,
      message: "OK - Status pengajuan berhasil diperbarui",
      data: result
    });
  } catch (err) {
    const status = err.message === 'Not found' ? 404 : 400;
    res.status(status).json({
      error: true,
      status,
      message: `${status === 404 ? 'Not Found' : 'Bad Request'} - ${err.message}`,
      data: null
    });
  }
};

exports.cancel = async (req, res) => {
  try {
    await submissionService.cancel(req.params.id, req.user.id);
    res.status(200).json({
      error: false,
      status: 200,
      message: "OK - Pengajuan berhasil dibatalkan",
      data: { message: "Dibatalkan" }
    });
  } catch (err) {
    res.status(403).json({
      error: true,
      status: 403,
      message: "Forbidden - " + err.message,
      data: null
    });
  }
};
