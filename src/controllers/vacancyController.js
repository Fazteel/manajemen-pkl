const vacancyService = require('../services/vacancyService');

exports.getAll = async (req, res) => {
  try {
    const vacancies = await vacancyService.getAll();
    res.status(200).json({
      error: false,
      status: 200,
      message: "OK - Vacancies fetched successfully",
      data: vacancies
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

exports.getOne = async (req, res) => {
  try {
    const vacancy = await vacancyService.getOne(req.params.id);
    res.status(200).json({
      error: false,
      status: 200,
      message: "OK - Vacancy fetched successfully",
      data: vacancy
    });
  } catch (err) {
    res.status(404).json({
      error: true,
      status: 404,
      message: "Not Found - " + err.message,
      data: null
    });
  }
};

exports.create = async (req, res) => {
  try {
    const payload = { ...req.body };

    if (req.file) {
      const imageUrl = `${req.protocol}://${req.get('host')}/public/uploads/${req.file.filename}`;
      payload.gambar_url = imageUrl;
    }
    const result = await vacancyService.create(payload);
    
    res.status(201).json({
      error: false,
      status: 201,
      message: "Created - Vacancy successfully created",
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

exports.update = async (req, res) => {
  try {
    const payload = { ...req.body };
    if (req.file) {
      const imageUrl = `${req.protocol}://${req.get('host')}/public/uploads/${req.file.filename}`;
      payload.gambar_url = imageUrl;
    }
    const result = await vacancyService.update(req.params.id, req.body);
    res.status(200).json({
      error: false,
      status: 200,
      message: "OK - Vacancy updated successfully",
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

exports.remove = async (req, res) => {
  try {
    await vacancyService.remove(req.params.id);
    res.status(200).json({
      error: false,
      status: 200,
      message: "OK - Vacancy deleted successfully",
      data: {
        message: "Deleted"
      }
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
