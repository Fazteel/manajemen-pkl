'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class VacancySubmission extends Model {
    static associate(models) {
      this.belongsTo(models.Vacancy, { foreignKey: 'lowongan_id' });
    }
  }

  VacancySubmission.init({
    siswa_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    lowongan_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('menunggu', 'diterima', 'ditolak'),
      allowNull: false,
      defaultValue: 'menunggu',
    },
    tanggal_ajuan: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'VacancySubmission',
    tableName: 'vacancy_submission',
    timestamps: true,
    paranoid: true,
    underscored: false,
  });

  return VacancySubmission;
};
