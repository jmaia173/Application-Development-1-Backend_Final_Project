const request = require('supertest');
const { setupDatabase, User } = require('../database');
const createTestApp = require('./testApp');

const app = createTestApp();
let testUser;

beforeAll(async () => {
  await setupDatabase();
  testUser = await User.create({ name: 'Test User', email: 'test@test.com', password: 'password123', role: 'player' });
});

describe('Users API', () => {
  test('GET /users - returns all users', async () => {
    const res = await request(app).get('/users');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('GET /users/:id - returns a single user', async () => {
    const res = await request(app).get(`/users/${testUser.id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('name', 'Test User');
    expect(res.body).not.toHaveProperty('password');
  });

  test('GET /users/:id - returns 404 for non-existent user', async () => {
    const res = await request(app).get('/users/999');
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('error', 'User not found');
  });

  test('POST /users - creates a new user', async () => {
    const res = await request(app).post('/users').send({
      name: 'New User',
      email: 'newuser@test.com',
      password: 'password123',
      role: 'player'
    });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('name', 'New User');
    expect(res.body).not.toHaveProperty('password');
  });

  test('POST /users - returns 400 when required fields missing', async () => {
    const res = await request(app).post('/users').send({});
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  test('PUT /users/:id - updates a user', async () => {
    const res = await request(app).put(`/users/${testUser.id}`).send({
      name: 'Updated User',
      email: 'updated@test.com'
    });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('name', 'Updated User');
  });

  test('GET /users/me - returns current user profile', async () => {
  const res = await request(app).get('/users/me');
  expect(res.statusCode).toBe(200);
  expect(res.body).not.toHaveProperty('password');
});

  test('DELETE /users/:id - deletes a user', async () => {
    const user = await User.create({ name: 'Delete Me', email: 'delete@test.com', password: 'password123', role: 'player' });
    const res = await request(app).delete(`/users/${user.id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'User deleted successfully');
  });
});