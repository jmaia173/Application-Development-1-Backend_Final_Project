const request = require('supertest');
const { setupDatabase, Team, Game } = require('../database');
const createTestApp = require('./testApp');

const app = createTestApp();
let testGame, homeTeam, awayTeam;

beforeAll(async () => {
  await setupDatabase();
  homeTeam = await Team.create({ name: 'Home Team', sport: 'Soccer', homeLocation: 'Home Stadium' });
  awayTeam = await Team.create({ name: 'Away Team', sport: 'Soccer', homeLocation: 'Away Stadium' });
  testGame = await Game.create({ date: '2026-05-01', location: 'Home Stadium', homeScore: 2, awayScore: 1, homeTeamId: homeTeam.id, awayTeamId: awayTeam.id });
});

describe('Games API', () => {
  test('GET /games - returns all games', async () => {
    const res = await request(app).get('/games');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('GET /games/:id - returns a single game', async () => {
    const res = await request(app).get(`/games/${testGame.id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('location', 'Home Stadium');
  });

  test('GET /games/:id - returns 404 for non-existent game', async () => {
    const res = await request(app).get('/games/999');
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('error', 'Game not found');
  });

  test('POST /games - creates a new game', async () => {
    const res = await request(app).post('/games').send({
      date: '2026-06-01',
      location: 'Away Stadium',
      homeScore: 0,
      awayScore: 0,
      homeTeamId: homeTeam.id,
      awayTeamId: awayTeam.id
    });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('location', 'Away Stadium');
  });

  test('POST /games - returns 400 when required fields missing', async () => {
    const res = await request(app).post('/games').send({});
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  test('PUT /games/:id - updates a game', async () => {
    const res = await request(app).put(`/games/${testGame.id}`).send({
      date: '2026-05-01',
      location: 'Updated Stadium',
      homeTeamId: homeTeam.id,
      awayTeamId: awayTeam.id
    });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('location', 'Updated Stadium');
  });

  test('GET /games/upcoming - returns upcoming games', async () => {
  const res = await request(app).get('/games/upcoming');
  expect(res.statusCode).toBe(200);
  expect(Array.isArray(res.body)).toBe(true);
});

test('GET /games/results - returns past game results', async () => {
  const res = await request(app).get('/games/results');
  expect(res.statusCode).toBe(200);
  expect(Array.isArray(res.body)).toBe(true);
});

  test('DELETE /games/:id - deletes a game', async () => {
    const game = await Game.create({ date: '2026-07-01', location: 'Delete Stadium', homeTeamId: homeTeam.id, awayTeamId: awayTeam.id });
    const res = await request(app).delete(`/games/${game.id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Game deleted successfully');
  });
});