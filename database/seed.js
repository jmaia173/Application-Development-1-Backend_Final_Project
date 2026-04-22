const bcrypt = require('bcryptjs');
const { setupDatabase, User, Team, Player, Game } = require('./index');

const seed = async () => {
  await setupDatabase();

  // Clear existing data in correct order
  await Game.destroy({ where: {} });
  await Player.destroy({ where: {} });
  await Team.destroy({ where: {} });
  await User.destroy({ where: {} });

  console.log('Cleared existing data...');

  const hashedPassword = await bcrypt.hash('password123', 10);

  // Create users
  const users = await User.bulkCreate([
    { name: 'Carlos Silva', email: 'carlos@league.com', password: hashedPassword, role: 'admin' },
    { name: 'Marco Rossi', email: 'marco@league.com', password: hashedPassword, role: 'coach' },
    { name: 'Diego Fernandez', email: 'diego@league.com', password: hashedPassword, role: 'coach' },
    { name: 'Lucas Oliveira', email: 'lucas@league.com', password: hashedPassword, role: 'player' },
    { name: 'Rafael Santos', email: 'rafael@league.com', password: hashedPassword, role: 'player' },
    { name: 'Bruno Costa', email: 'bruno@league.com', password: hashedPassword, role: 'player' },
    { name: 'Pedro Alves', email: 'pedro@league.com', password: hashedPassword, role: 'player' },
    { name: 'Mateus Lima', email: 'mateus@league.com', password: hashedPassword, role: 'player' }
  ]);

  console.log('Users created...');

  // Create teams
  const teams = await Team.bulkCreate([
    { name: 'Ashland FC', sport: 'Soccer', homeLocation: 'Ashland Sports Park', coachId: users[1].id },
    { name: 'Medford United', sport: 'Soccer', homeLocation: 'Medford Stadium', coachId: users[2].id },
    { name: 'Rogue Valley SC', sport: 'Soccer', homeLocation: 'Rogue Valley Field', coachId: null },
    { name: 'Southern Oregon FC', sport: 'Soccer', homeLocation: 'SOSC Field', coachId: null }
  ]);

  console.log('Teams created...');

  // Create players
  await Player.bulkCreate([
    { name: 'Lucas Oliveira', position: 'Goalkeeper', jerseyNumber: 1, goals: 0, assists: 1, teamId: teams[0].id },
    { name: 'Rafael Santos', position: 'Defender', jerseyNumber: 4, goals: 2, assists: 3, teamId: teams[0].id },
    { name: 'Bruno Costa', position: 'Midfielder', jerseyNumber: 8, goals: 5, assists: 7, teamId: teams[0].id },
    { name: 'Pedro Alves', position: 'Forward', jerseyNumber: 9, goals: 10, assists: 4, teamId: teams[0].id },
    { name: 'Mateus Lima', position: 'Defender', jerseyNumber: 5, goals: 1, assists: 2, teamId: teams[0].id },
    { name: 'Andre Pereira', position: 'Midfielder', jerseyNumber: 6, goals: 3, assists: 5, teamId: teams[1].id },
    { name: 'Felipe Souza', position: 'Forward', jerseyNumber: 11, goals: 8, assists: 2, teamId: teams[1].id },
    { name: 'Gustavo Nunes', position: 'Goalkeeper', jerseyNumber: 1, goals: 0, assists: 0, teamId: teams[1].id },
    { name: 'Thiago Carvalho', position: 'Defender', jerseyNumber: 3, goals: 1, assists: 1, teamId: teams[2].id },
    { name: 'Vinicius Rocha', position: 'Forward', jerseyNumber: 10, goals: 6, assists: 3, teamId: teams[2].id },
    { name: 'Gabriel Moura', position: 'Midfielder', jerseyNumber: 7, goals: 4, assists: 6, teamId: teams[3].id },
    { name: 'Henrique Dias', position: 'Defender', jerseyNumber: 2, goals: 0, assists: 2, teamId: teams[3].id }
  ]);

  console.log('Players created...');

  // Create games
  await Game.bulkCreate([
    { date: '2026-03-01', location: 'Ashland Sports Park', homeScore: 3, awayScore: 1, homeTeamId: teams[0].id, awayTeamId: teams[1].id },
    { date: '2026-03-08', location: 'Medford Stadium', homeScore: 2, awayScore: 2, homeTeamId: teams[1].id, awayTeamId: teams[2].id },
    { date: '2026-03-15', location: 'Rogue Valley Field', homeScore: 0, awayScore: 1, homeTeamId: teams[2].id, awayTeamId: teams[3].id },
    { date: '2026-03-22', location: 'SOSC Field', homeScore: 1, awayScore: 3, homeTeamId: teams[3].id, awayTeamId: teams[0].id },
    { date: '2026-04-05', location: 'Ashland Sports Park', homeScore: 2, awayScore: 0, homeTeamId: teams[0].id, awayTeamId: teams[2].id },
    { date: '2026-04-12', location: 'Medford Stadium', homeScore: 1, awayScore: 1, homeTeamId: teams[1].id, awayTeamId: teams[3].id },
    { date: '2026-04-19', location: 'Ashland Sports Park', homeScore: 0, awayScore: 0, homeTeamId: teams[0].id, awayTeamId: teams[3].id },
    { date: '2026-05-03', location: 'Rogue Valley Field', homeScore: 0, awayScore: 0, homeTeamId: teams[2].id, awayTeamId: teams[1].id }
  ]);

  console.log('Games created...');
  console.log('Database seeded successfully!');
  process.exit(0);
};

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});