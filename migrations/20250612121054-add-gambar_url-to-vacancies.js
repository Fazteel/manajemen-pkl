'use strict';

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('vacancy', 'gambar_url', {
      type: DataTypes.STRING,
      allowNull: true,
      after: 'tanggal_dibuka'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('vacancy', 'gambar_url');
  }
};
