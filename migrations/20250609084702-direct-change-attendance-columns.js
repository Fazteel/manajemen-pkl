'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('attendance', 'check_in', {
      type: Sequelize.DATE, // Mengubah ke DATETIME
      allowNull: true,
    });
    
    await queryInterface.changeColumn('attendance', 'check_out', {
      type: Sequelize.DATE, // Mengubah ke DATETIME
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    // Logika untuk mengembalikan (rollback)
    await queryInterface.changeColumn('attendance', 'check_in', {
      type: Sequelize.TIME, // Mengembalikan ke TIME
      allowNull: true,
    });
    
    await queryInterface.changeColumn('attendance', 'check_out', {
      type: Sequelize.TIME, // Mengembalikan ke TIME
      allowNull: true,
    });
  }
};