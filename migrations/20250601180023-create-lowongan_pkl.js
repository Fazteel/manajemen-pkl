'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('vacancy', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      nama_perusahaan: Sequelize.STRING,
      deskripsi: Sequelize.TEXT,
      lokasi: Sequelize.STRING,
      kuota: Sequelize.INTEGER,
      tanggal_dibuka: Sequelize.DATEONLY,
      status: {
        type: Sequelize.ENUM('dibuka', 'ditutup'),
        defaultValue: 'dibuka',
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('vacancy');
  }
};
