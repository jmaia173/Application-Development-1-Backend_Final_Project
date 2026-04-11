const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Game', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false
    },
    homeScore: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    awayScore: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    homeTeamId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Teams', key: 'id' }
    },
    awayTeamId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Teams', key: 'id' }
    }
  });
};