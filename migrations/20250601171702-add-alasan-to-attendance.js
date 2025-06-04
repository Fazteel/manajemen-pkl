'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Ubah defaultValue kolom 'keterangan'
    await queryInterface.changeColumn('attendance', 'keterangan', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'alpha',
    });

    // Tambahkan kolom 'alasan'
    await queryInterface.addColumn('attendance', 'alasan', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    // Kembalikan perubahan default kolom 'keterangan' (jika perlu)
    await queryInterface.changeColumn('attendance', 'keterangan', {
      type: Sequelize.STRING,
      allowNull: false,
      // Hapus default jika sebelumnya tidak ada
    });

    // Hapus kolom 'alasan'
    await queryInterface.removeColumn('attendance', 'alasan');
  }
};
