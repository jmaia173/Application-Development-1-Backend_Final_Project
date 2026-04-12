const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: ':memory:',
  logging: false
});

const User = require('./models/User')(sequelize);
const Team = require('./models/Team')(sequelize);
const Player = require('./models/Player')(sequelize);
const Game = require('./models/Game')(sequelize);

User.hasMany(Team, { foreignKey: 'coachId', as: 'teams' });
Team.belongsTo(User, { foreignKey: 'coachId', as: 'coach' });

Team.hasMany(Player, { foreignKey: 'teamId', as: 'players' });
Player.belongsTo(Team, { foreignKey: 'teamId', as: 'team' });

Team.hasMany(Game, { foreignKey: 'homeTeamId', as: 'homeGames' });
Team.hasMany(Game, { foreignKey: 'awayTeamId', as: 'awayGames' });
Game.belongsTo(Team, { foreignKey: 'homeTeamId', as: 'homeTeam' });
Game.belongsTo(Team, { foreignKey: 'awayTeamId', as: 'awayTeam' });

const setupTestDatabase = async () => {
  await sequelize.sync({ force: true });
};

module.exports = { sequelize, setupTestDatabase, User, Team, Player, Game };