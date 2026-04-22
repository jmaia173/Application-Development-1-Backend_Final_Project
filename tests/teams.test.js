const request = require('supertest');
const { setupDatabase, Team, User } = require('../database');
const createTestApp = require('./testApp');

const app = createTestApp();
let testTeam;

beforeAll(async () => {
  await setupDatabase();
  await User.create({ name: 'Test Coach', email: 'coach@test.com', password: 'password123', role: 'coach' });
  testTeam = await Team.create({ name: 'Test Team', sport: 'Soccer', homeLocation: 'Test Stadium' });
});

describe('Teams API', () => {
  test('GET /teams - returns all teams', async () => {
    const res = await request(app).get('/teams');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test('GET /teams/:id - returns a single team', async () => {
    const res = await request(app).get(`/teams/${testTeam.id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('name', 'Test Team');
  });

  test('GET /teams/:id - returns 404 for non-existent team', async () => {
    const res = await request(app).get('/teams/999');
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('error', 'Team not found');
  });

  test('POST /teams - creates a new team', async () => {
    const res = await request(app).post('/teams').send({
      name: 'New Team',
      sport: 'Soccer',
      homeLocation: 'New Stadium'
    });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('name', 'New Team');
  });

  test('POST /teams - returns 400 when required fields missing', async () => {
    const res = await request(app).post('/teams').send({});
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  test('PUT /teams/:id - updates a team', async () => {
    const res = await request(app).put(`/teams/${testTeam.id}`).send({
      name: 'Updated Team',
      homeLocation: 'Updated Stadium'
    });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('name', 'Updated Team');
  });

  test('GET /teams/:id/players - returns players for a team', async () => {
  const res = await request(app).get(`/teams/${testTeam.id}/players`);
  expect(res.statusCode).toBe(200);
  expect(Array.isArray(res.body)).toBe(true);
});

test('GET /teams/:id/games - returns games for a team', async () => {
  const res = await request(app).get(`/teams/${testTeam.id}/games`);
  expect(res.statusCode).toBe(200);
  expect(Array.isArray(res.body)).toBe(true);
});

test('GET /teams/:id - returns 404 for non-existent team', async () => {
  const res = await request(app).get('/teams/999');
  expect(res.statusCode).toBe(404);
});

  test('DELETE /teams/:id - deletes a team', async () => {
    const team = await Team.create({ name: 'Delete Me', sport: 'Soccer', homeLocation: 'Somewhere' });
    const res = await request(app).delete(`/teams/${team.id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Team deleted successfully');
  });
});