const { Vacancy } = require('../models/index');
const fs = require('fs');
const path = require('path');

exports.getAll = async () => {
  const data = await Vacancy.findAll();
  return data;
};

exports.getOne = async (id) => {
  const data = await Vacancy.findByPk(id);
  if (!data) throw new Error("Vacancy not found");
  return data;
};

exports.create = async (payload) => {
  const { nama_perusahaan, deskripsi, lokasi, kuota, tanggal_dibuka, gambar_url } = payload;
  if (!nama_perusahaan || !deskripsi || !lokasi || kuota == null || !tanggal_dibuka) {
    throw new Error("All fields except image are required");
  }

  if (kuota <= 0) throw new Error("Kuota harus lebih dari 0");
  if (new Date(tanggal_dibuka) < new Date()) throw new Error("Tanggal dibuka tidak valid");

  const result = await Vacancy.create({ nama_perusahaan, deskripsi, lokasi, kuota, tanggal_dibuka, gambar_url });
  return result;
};

exports.update = async (id, payload) => {
  const vacancy = await Vacancy.findByPk(id);
  if (!vacancy) throw new Error("Vacancy not found");

  if (payload.gambar_url && vacancy.gambar_url) {
    const oldImageName = vacancy.gambar_url.split('/').pop();
    const oldImagePath = path.join(__dirname, '..', 'public', 'uploads', oldImageName);
    
    if (fs.existsSync(oldImagePath)) {
      fs.unlinkSync(oldImagePath);
    }
  }

  await vacancy.update(payload);
  return vacancy;
};

exports.remove = async (id) => {
  const vacancy = await Vacancy.findByPk(id);
  if (!vacancy) throw new Error("Vacancy not found");

  await Vacancy.destroy({ where: { id } });
  return true;
};
