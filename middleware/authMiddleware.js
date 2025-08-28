const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization') || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.replace('Bearer ', '') : null;
    if (!token) return res.status(401).json({ error: 'No token, authorization denied' });

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ error: 'Token is not valid' });
    }

    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ error: 'User not found' });

    // Ensure token exists in user's tokens array (so logout can remove it)
    if (!user.tokens || !user.tokens.includes(token)) {
      return res.status(401).json({ error: 'Token is invalid or logged out' });
    }

    req.user = user;
    req.token = token;
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = authMiddleware;
