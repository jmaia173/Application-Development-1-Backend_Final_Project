const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Player', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    position: {
      type: DataTypes.STRING,
      allowNull: false
    },
    jerseyNumber: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    goals: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    assists: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    teamId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'Teams', key: 'id' }
    }
  });
};