const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const { Player, Team } = require('../database');
const { validatePlayer } = require('../middleware/validate');
const { isAdminOrCoach } = require('../middleware/auth');

// GET /players/search - search and filter players
router.get('/search', async (req, res) => {
  try {
    const { position, teamId, name } = req.query;
    const where = {};
    if (position) where.position = position;
    if (teamId) where.teamId = teamId;
    if (name) where.name = { [Op.like]: `%${name}%` };

    const players = await Player.findAll({
      where,
      include: [{ model: Team, as: 'team', attributes: ['id', 'name'] }]
    });
    res.status(200).json(players);
  } catch (err) {
    res.status(500).json({ error: 'Failed to search players' });
  }
});

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

// POST create player - admin or coach
router.post('/', isAdminOrCoach, validatePlayer, async (req, res) => {
  try {
    const { name, position, jerseyNumber, goals, assists, teamId } = req.body;

    if (req.user.role === 'coach') {
      const team = await Team.findByPk(teamId);
      if (!team || team.coachId !== req.user.id) {
        return res.status(403).json({ error: 'Access denied. You can only add players to your own team.' });
      }
    }

    const player = await Player.create({ name, position, jerseyNumber, goals, assists, teamId });
    res.status(201).json(player);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create player' });
  }
});

// PUT update player - admin or coach
router.put('/:id', isAdminOrCoach, validatePlayer, async (req, res) => {
  try {
    const player = await Player.findByPk(req.params.id);
    if (!player) return res.status(404).json({ error: 'Player not found' });

    if (req.user.role === 'coach') {
      const team = await Team.findByPk(player.teamId);
      if (!team || team.coachId !== req.user.id) {
        return res.status(403).json({ error: 'Access denied. You can only update players on your own team.' });
      }
    }

    const { name, position, jerseyNumber, goals, assists, teamId } = req.body;
    await player.update({ name, position, jerseyNumber, goals, assists, teamId });
    res.status(200).json(player);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update player' });
  }
});

// DELETE player - admin or coach
router.delete('/:id', isAdminOrCoach, async (req, res) => {
  try {
    const player = await Player.findByPk(req.params.id);
    if (!player) return res.status(404).json({ error: 'Player not found' });

    if (req.user.role === 'coach') {
      const team = await Team.findByPk(player.teamId);
      if (!team || team.coachId !== req.user.id) {
        return res.status(403).json({ error: 'Access denied. You can only delete players on your own team.' });
      }
    }

    await player.destroy();
    res.status(200).json({ message: 'Player deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete player' });
  }
});

module.exports = router;