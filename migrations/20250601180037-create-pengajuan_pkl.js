'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('vacancy_submission', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      siswa_id: { type: Sequelize.INTEGER },
      lowongan_id: { type: Sequelize.INTEGER },
      status: Sequelize.ENUM('menunggu', 'diterima', 'ditolak'),
      tanggal_ajuan: Sequelize.DATEONLY,
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('vacancy_submission');
  }
};