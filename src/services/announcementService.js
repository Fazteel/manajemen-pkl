const { Announcement } = require('../models');

exports.getAll = async () => {
  return await Announcement.findAll({
    order: [['createdAt', 'DESC']]
  });
};

exports.getOne = async (id) => {
  const announcement = await Announcement.findByPk(id);
  if (!announcement) {
    throw new Error("Pengumuman dengan ID tersebut tidak ditemukan");
  }
  return announcement;
};

exports.create = async (payload) => {
  const { judul, isi } = payload;
  if (!judul || !isi) {
    throw new Error("Judul dan isi pengumuman wajib diisi");
  }
  return await Announcement.create(payload);
};

exports.update = async (id, payload) => {
  const announcement = await this.getOne(id);
  return await announcement.update(payload);
};

exports.remove = async (id) => {
  await this.getOne(id);
  await Announcement.destroy({ where: { id } });
};