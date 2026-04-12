const express = require('express');
const router = express.Router();
const { Player, Team } = require('../database');
const { validatePlayer } = require('../middleware/validate');

// GET all players
router.get('/', async (req, res) => {
  try {
    const players = await Player.findAll({
      include: [{ model: Team, as: 'team', attributes: ['id', 'name'] }]
    });
    res.status(200).json(players);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve players' });
  }
});

// GET player by ID
router.get('/:id', async (req, res) => {
  try {
    const player = await Player.findByPk(req.params.id, {
      include: [{ model: Team, as: 'team', attributes: ['id', 'name'] }]
    });
    if (!player) return res.status(404).json({ error: 'Player not found' });
    res.status(200).json(player);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve player' });
  }
});

// POST create player
router.post('/', validatePlayer, async (req, res) => {
  try {
    const { name, position, jerseyNumber, goals, assists, teamId } = req.body;
    const player = await Player.create({ name, position, jerseyNumber, goals, assists, teamId });
    res.status(201).json(player);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create player' });
  }
});

// PUT update player
router.put('/:id', validatePlayer, async (req, res) => {
  try {
    const player = await Player.findByPk(req.params.id);
    if (!player) return res.status(404).json({ error: 'Player not found' });
    const { name, position, jerseyNumber, goals, assists, teamId } = req.body;
    await player.update({ name, position, jerseyNumber, goals, assists, teamId });
    res.status(200).json(player);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update player' });
  }
});

// DELETE player
router.delete('/:id', async (req, res) => {
  try {
    const player = await Player.findByPk(req.params.id);
    if (!player) return res.status(404).json({ error: 'Player not found' });
    await player.destroy();
    res.status(200).json({ message: 'Player deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete player' });
  }
});

module.exports = router;