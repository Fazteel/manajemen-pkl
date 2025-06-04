'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Attendance extends Model {
       /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
        static associate(models) {
      // define association here
      Attendance.belongsTo(models.User, { foreignKey: 'user_id' });
    }
  }
  Attendance.init({
    user_id: DataTypes.INTEGER,
    tanggal: DataTypes.DATEONLY,
    check_in: DataTypes.DATE,
    check_out: DataTypes.DATE,
    keterangan: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'alpha',
    },
    alasan: {
        type: DataTypes.STRING,
        allowNull: true,
    },
  }, {
    sequelize,
    modelName: 'Attendance',
    tableName: 'attendance',
    timestamps: true,
    underscored: true,
  });
  return Attendance;
};
