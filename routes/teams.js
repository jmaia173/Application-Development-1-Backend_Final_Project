const express = require('express');
const router = express.Router();
const { Team, User, Player } = require('../database');
const { validateTeam } = require('../middleware/validate');
const { isAdmin, isAdminOrCoach } = require('../middleware/auth');

// GET all teams - all authenticated users
router.get('/', async (req, res) => {
  try {
    const teams = await Team.findAll({
      include: [
        { model: User, as: 'coach', attributes: ['id', 'name', 'email'] },
        { model: Player, as: 'players' }
      ]
    });
    res.status(200).json(teams);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve teams' });
  }
});

// GET team by ID - all authenticated users
router.get('/:id', async (req, res) => {
  try {
    const team = await Team.findByPk(req.params.id, {
      include: [
        { model: User, as: 'coach', attributes: ['id', 'name', 'email'] },
        { model: Player, as: 'players' }
      ]
    });
    if (!team) return res.status(404).json({ error: 'Team not found' });
    res.status(200).json(team);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve team' });
  }
});

// POST create team - admin only
router.post('/', isAdmin, validateTeam, async (req, res) => {
  try {
    const { name, sport, homeLocation, coachId } = req.body;
    const team = await Team.create({ name, sport, homeLocation, coachId });
    res.status(201).json(team);
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'Team name already exists' });
    }
    res.status(500).json({ error: 'Failed to create team' });
  }
});

// PUT update team - admin or coach of that team
router.put('/:id', isAdminOrCoach, validateTeam, async (req, res) => {
  try {
    const team = await Team.findByPk(req.params.id);
    if (!team) return res.status(404).json({ error: 'Team not found' });

    // Coach can only update their own team
    if (req.user.role === 'coach' && team.coachId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied. You can only update your own team.' });
    }

    const { name, sport, homeLocation, coachId } = req.body;
    await team.update({ name, sport, homeLocation, coachId });
    res.status(200).json(team);
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'Team name already exists' });
    }
    if (err.name === 'SequelizeValidationError') {
      return res.status(400).json({ error: err.errors.map(e => e.message).join(', ') });
    }
    res.status(500).json({ error: 'Failed to update team' });
  }
});

// DELETE team - admin only
router.delete('/:id', isAdmin, async (req, res) => {
  try {
    const team = await Team.findByPk(req.params.id);
    if (!team) return res.status(404).json({ error: 'Team not found' });
    await team.destroy();
    res.status(200).json({ message: 'Team deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete team' });
  }
});

module.exports = router;