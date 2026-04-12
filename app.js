require('dotenv').config();
const express = require('express');
const { setupDatabase } = require('./database');
const logger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

// Routes
app.use('/users', require('./routes/users'));
app.use('/teams', require('./routes/teams'));
app.use('/players', require('./routes/players'));
app.use('/games', require('./routes/games'));

// Health check
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Sports League API is running' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use(errorHandler);

// Start server
setupDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

module.exports = app;