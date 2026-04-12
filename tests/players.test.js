const request = require('supertest');
const { setupDatabase, Team, Player } = require('../database');
const createTestApp = require('./testApp');

const app = createTestApp();
let testPlayer, testTeam;

beforeAll(async () => {
  await setupDatabase();
  testTeam = await Team.create({ name: 'Test Team', sport: 'Soccer', homeLocation: 'Test Stadium' });
  testPlayer = await Player.create({ name: 'Test Player', position: 'Forward', jerseyNumber: 9, teamId: testTeam.id });
});

describe('Players API', () => {
  test('GET /players - returns all players', async () => {
    const res = await request(app).get('/players');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('GET /players/:id - returns a single player', async () => {
    const res = await request(app).get(`/players/${testPlayer.id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('name', 'Test Player');
  });

  test('GET /players/:id - returns 404 for non-existent player', async () => {
    const res = await request(app).get('/players/999');
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('error', 'Player not found');
  });

  test('POST /players - creates a new player', async () => {
    const res = await request(app).post('/players').send({
      name: 'New Player',
      position: 'Midfielder',
      jerseyNumber: 10,
      teamId: testTeam.id
    });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('name', 'New Player');
  });

  test('POST /players - returns 400 when required fields missing', async () => {
    const res = await request(app).post('/players').send({});
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  test('PUT /players/:id - updates a player', async () => {
    const res = await request(app).put(`/players/${testPlayer.id}`).send({
      name: 'Updated Player',
      position: 'Defender',
      jerseyNumber: 5
    });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('name', 'Updated Player');
  });

  test('DELETE /players/:id - deletes a player', async () => {
    const player = await Player.create({ name: 'Delete Me', position: 'Forward', jerseyNumber: 99 });
    const res = await request(app).delete(`/players/${player.id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Player deleted successfully');
  });
});