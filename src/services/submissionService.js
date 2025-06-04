const { VacancySubmission, Vacancy } = require('../models/index');
const { Op } = require('sequelize');

exports.create = async (siswaId, lowonganId) => {
  const existing = await VacancySubmission.findOne({
    where: {
      siswa_id: siswaId,
      status: { [Op.in]: ['menunggu', 'diterima'] }
    }
  });
  if (existing) throw new Error('Sudah mengajukan');

  const lowongan = await Vacancy.findByPk(lowonganId);
  if (!lowongan || lowongan.kuota <= 0) throw new Error('Kuota habis');

  const pengajuan = await VacancySubmission.create({
    siswa_id: siswaId,
    lowongan_id: lowonganId,
    status: 'menunggu',
    tanggal_ajuan: new Date()
  });

  return pengajuan;
};

exports.getMe = async (siswaId) => {
  const pengajuan = await VacancySubmission.findAll({
    where: { siswa_id: siswaId },
    include: 'Vacancy'
  });
  return pengajuan;
};

exports.getAll = async () => {
  const data = await VacancySubmission.findAll({ include: 'Vacancy' });
  return data;
};

exports.approve = async (pengajuanId, status) => {
  const pengajuan = await VacancySubmission.findByPk(pengajuanId);
  if (!pengajuan) throw new Error('Not found');

  if (status === 'diterima') {
    const lowongan = await Vacancy.findByPk(pengajuan.lowongan_id);
    if (!lowongan || lowongan.kuota <= 0) throw new Error('Kuota habis');

    lowongan.kuota -= 1;
    if (lowongan.kuota === 0) lowongan.status = 'ditutup';
    await lowongan.save();
  }

  pengajuan.status = status;
  await pengajuan.save();
  return pengajuan;
};

exports.cancel = async (pengajuanId, siswaId) => {
  const pengajuan = await VacancySubmission.findByPk(pengajuanId);
  if (!pengajuan || pengajuan.siswa_id !== siswaId || pengajuan.status !== 'menunggu') {
    throw new Error('Tidak bisa dibatalkan');
  }

  await pengajuan.destroy();
  return true;
};
