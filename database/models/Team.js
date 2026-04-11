const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Team', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    sport: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Soccer'
    },
    homeLocation: {
      type: DataTypes.STRING,
      allowNull: false
    },
    coachId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'Users', key: 'id' }
    }
  });
};