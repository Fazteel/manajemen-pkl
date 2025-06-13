'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Announcement extends Model {
    static associate(models) {
    }
  }
  Announcement.init({
    judul: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isi: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    penulis: {
      type: DataTypes.STRING,
      allowNull: true, 
    },
    kategori: {
      type: DataTypes.STRING,
      allowNull: true, 
    },
    ditujukan_kepada: {
      type: DataTypes.STRING,
      allowNull: true, 
    }
  }, {
    sequelize,
    modelName: 'Announcement',
    tableName: 'announcements', 
  });
  return Announcement;
};