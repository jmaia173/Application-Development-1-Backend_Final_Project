const validateTeam = (req, res, next) => {
  const { name, homeLocation } = req.body;
  if (!name || !homeLocation) {
    return res.status(400).json({
      error: 'Validation error',
      details: 'Name and homeLocation are required'
    });
  }
  next();
};

const validatePlayer = (req, res, next) => {
  const { name, position, jerseyNumber } = req.body;
  if (!name || !position || !jerseyNumber) {
    return res.status(400).json({
      error: 'Validation error',
      details: 'Name, position, and jerseyNumber are required'
    });
  }
  if (isNaN(jerseyNumber)) {
    return res.status(400).json({
      error: 'Validation error',
      details: 'jerseyNumber must be a number'
    });
  }
  next();
};

const validateGame = (req, res, next) => {
  const { date, location, homeTeamId, awayTeamId } = req.body;
  if (!date || !location || !homeTeamId || !awayTeamId) {
    return res.status(400).json({
      error: 'Validation error',
      details: 'Date, location, homeTeamId, and awayTeamId are required'
    });
  }
  if (homeTeamId === awayTeamId) {
    return res.status(400).json({
      error: 'Validation error',
      details: 'Home and away teams must be different'
    });
  }
  next();
};

const validateUser = (req, res, next) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({
      error: 'Validation error',
      details: 'Name, email, and password are required'
    });
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      error: 'Validation error',
      details: 'Invalid email format'
    });
  }
  next();
};

module.exports = { validateTeam, validatePlayer, validateGame, validateUser };