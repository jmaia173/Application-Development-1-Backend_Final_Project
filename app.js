require('dotenv').config();
const express = require('express');
const logger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const { authenticate, isAdmin, isAdminOrCoach } = require('./middleware/auth');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

// Public routes
app.use('/auth', require('./routes/auth'));

// Health check
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Sports League API is running' });
});

// Protected routes
app.use('/users', authenticate, isAdmin, require('./routes/users'));
app.use('/teams', authenticate, require('./routes/teams'));
app.use('/players', authenticate, require('./routes/players'));
app.use('/games', authenticate, require('./routes/games'));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use(errorHandler);

module.exports = { app, setupDatabase: require('./database').setupDatabase };