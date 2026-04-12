const express = require('express');
const router = express.Router();
const { Game, Team } = require('../database');
const { validateGame } = require('../middleware/validate');

// GET all games
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

// GET game by ID
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

// POST create game
router.post('/', validateGame, async (req, res) => {
  try {
    const { date, location, homeScore, awayScore, homeTeamId, awayTeamId } = req.body;
    const game = await Game.create({ date, location, homeScore, awayScore, homeTeamId, awayTeamId });
    res.status(201).json(game);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create game' });
  }
});

// PUT update game
router.put('/:id', validateGame, async (req, res) => {
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

// DELETE game
router.delete('/:id', async (req, res) => {
  try {
    const game = await Game.findByPk(req.params.id);
    if (!game) return res.status(404).json({ error: 'Game not found' });
    await game.destroy();
    res.status(200).json({ message: 'Game deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete game' });
  }
});

module.exports = router;