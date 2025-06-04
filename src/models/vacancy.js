'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Vacancy extends Model {
    static associate(models) {
      this.hasMany(models.VacancySubmission, { foreignKey: 'lowongan_id' });
    }
  }

  Vacancy.init({
    nama_perusahaan: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    deskripsi: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    lokasi: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    kuota: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    tanggal_dibuka: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('dibuka', 'ditutup'),
      allowNull: false,
      defaultValue: 'dibuka',
    },
  }, {
    sequelize,
    modelName: 'Vacancy',
    tableName: 'vacancy',
    timestamps: true,
    paranoid: true,
    underscored: false,
  });

  return Vacancy;
};
