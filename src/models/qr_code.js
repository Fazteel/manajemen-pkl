'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class QrCode extends Model {
    /** 
     * Helper untuk mendefinisikan relasi.
     * Akan dipanggil otomatis oleh file models/index.js
     */
    static associate(models) {
      // QR dibuat oleh satu user (admin)
      QrCode.belongsTo(models.User, { foreignKey: 'created_by' });
    }
  }

  QrCode.init(
    {
      secret: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      created_by: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'QrCode',
      tableName: 'qr_codes',      // nama tabel di DB
      timestamps: true,           // createdAt & updatedAt
      paranoid: false,            // tidak memakai soft delete
      underscored: true,          // kolom snake_case
    }
  );

  return QrCode;
};
