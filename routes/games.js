const express = require('express');
const router = express.Router();
const { Game, Team } = require('../database');
const { validateGame } = require('../middleware/validate');
const { isAdmin } = require('../middleware/auth');

// GET all games - all authenticated users
router.get('/', async (req, res) => {
  try {
    const games = await Game.findAll({
      include: [
        { model: Team, as: 'homeTeam', attributes: ['id', 'name'] },
        { model: Team, as: 'awayTeam', attributes: ['id', 'name'] }
      ]
    });
    res.status(200).json(games);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve games' });
  }
});

// GET game by ID - all authenticated users
router.get('/:id', async (req, res) => {
  try {
    const game = await Game.findByPk(req.params.id, {
      include: [
        { model: Team, as: 'homeTeam', attributes: ['id', 'name'] },
        { model: Team, as: 'awayTeam', attributes: ['id', 'name'] }
      ]
    });
    if (!game) return res.status(404).json({ error: 'Game not found' });
    res.status(200).json(game);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve game' });
  }
});

// POST create game - admin only
router.post('/', isAdmin, validateGame, async (req, res) => {
  try {
    const { date, location, homeScore, awayScore, homeTeamId, awayTeamId } = req.body;
    const game = await Game.create({ date, location, homeScore, awayScore, homeTeamId, awayTeamId });
    res.status(201).json(game);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create game' });
  }
});

// PUT update game - admin only
router.put('/:id', isAdmin, validateGame, async (req, res) => {
  try {
    const game = await Game.findByPk(req.params.id);
    if (!game) return res.status(404).json({ error: 'Game not found' });
    const { date, location, homeScore, awayScore, homeTeamId, awayTeamId } = req.body;
    await game.update({ date, location, homeScore, awayScore, homeTeamId, awayTeamId });
    res.status(200).json(game);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update game' });
  }
});

// DELETE game - admin only
router.delete('/:id', isAdmin, async (req, res) => {
  try {
    const game = await Game.findByPk(req.params.id);
    if (!game) return res.status(404).json({ error: 'Game not found' });
    await game.destroy();
    res.status(200).json({ message: 'Game deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete game' });
  }
});

// GET /games?date=2026-03-01 - filter by date
// GET /games/upcoming - get upcoming games
router.get('/upcoming', async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const games = await Game.findAll({
      where: {
        date: { [require('sequelize').Op.gte]: today }
      },
      include: [
        { model: Team, as: 'homeTeam', attributes: ['id', 'name'] },
        { model: Team, as: 'awayTeam', attributes: ['id', 'name'] }
      ],
      order: [['date', 'ASC']]
    });
    res.status(200).json(games);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve upcoming games' });
  }
});

// GET /games/results - get past games with scores
router.get('/results', async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const games = await Game.findAll({
      where: {
        date: { [require('sequelize').Op.lt]: today }
      },
      include: [
        { model: Team, as: 'homeTeam', attributes: ['id', 'name'] },
        { model: Team, as: 'awayTeam', attributes: ['id', 'name'] }
      ],
      order: [['date', 'DESC']]
    });
    res.status(200).json(games);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve game results' });
  }
});

module.exports = router;