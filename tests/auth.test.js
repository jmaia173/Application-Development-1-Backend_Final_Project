const request = require('supertest');
const bcrypt = require('bcryptjs');
const { setupDatabase, User } = require('../database');
const createTestApp = require('./testApp');

process.env.JWT_SECRET = 'testsecret';
const app = createTestApp();
let authToken;

beforeAll(async () => {
  await setupDatabase();
  const hashedPassword = await bcrypt.hash('password123', 10);
  await User.create({ name: 'Test Admin', email: 'admin@test.com', password: hashedPassword, role: 'admin' });
});

describe('Auth API', () => {
  test('POST /auth/register - registers a new user', async () => {
    const res = await request(app).post('/auth/register').send({
      name: 'New User',
      email: 'newuser@test.com',
      password: 'password123',
      role: 'player'
    });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('name', 'New User');
    expect(res.body).not.toHaveProperty('password');
  });

  test('POST /auth/register - returns 400 when fields missing', async () => {
    const res = await request(app).post('/auth/register').send({ name: 'No Email' });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  test('POST /auth/register - returns 400 for duplicate email', async () => {
    const res = await request(app).post('/auth/register').send({
      name: 'Duplicate',
      email: 'admin@test.com',
      password: 'password123',
      role: 'player'
    });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error', 'Email already in use');
  });

  test('POST /auth/login - logs in with valid credentials', async () => {
    const res = await request(app).post('/auth/login').send({
      email: 'admin@test.com',
      password: 'password123'
    });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('message', 'Login successful');
    expect(res.body.user).toHaveProperty('role', 'admin');
    authToken = res.body.token;
  });

  test('POST /auth/login - returns 401 for wrong password', async () => {
    const res = await request(app).post('/auth/login').send({
      email: 'admin@test.com',
      password: 'wrongpassword'
    });
    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('error', 'Invalid email or password');
  });

  test('POST /auth/login - returns 401 for non-existent email', async () => {
    const res = await request(app).post('/auth/login').send({
      email: 'nobody@test.com',
      password: 'password123'
    });
    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('error', 'Invalid email or password');
  });

  test('POST /auth/login - returns 400 when fields missing', async () => {
    const res = await request(app).post('/auth/login').send({});
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  test('POST /auth/logout - logs out successfully with token', async () => {
    const res = await request(app)
      .post('/auth/logout')
      .set('Authorization', `Bearer ${authToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message');
  });
});