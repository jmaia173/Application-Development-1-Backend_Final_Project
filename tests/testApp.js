const express = require('express');
const logger = require('../middleware/logger');
const errorHandler = require('../middleware/errorHandler');

const createTestApp = () => {
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use('/users', require('../routes/users'));
  app.use('/teams', require('../routes/teams'));
  app.use('/players', require('../routes/players'));
  app.use('/games', require('../routes/games'));

  app.get('/', (req, res) => {
    res.status(200).json({ message: 'Sports League API is running' });
  });

  app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
  });

  app.use(errorHandler);

  return app;
};

module.exports = createTestApp;