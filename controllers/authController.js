const User = require('../models/User');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

exports.registerAdminManager = async (req, res) => {
  try {
    // Validate req
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, email, password, role } = req.body;

    // ensure only one admin OR manager of that role (mirrors Laravel)
    const exists = await User.exists({ role });
    if (exists) {
      return res.status(403).json({ error: `${role} already exists. Only one ${role} is allowed.` });
    }

    const user = new User({ name, email, password, role });
    await user.save();

    res.status(201).json({ message: `${role} created successfully`, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error(err);
    if (err.code === 11000) return res.status(400).json({ error: 'Email already in use' });
    res.status(500).json({ error: 'Server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    const token = await user.generateAuthToken();

    res.json({
      message: 'Login successful',
      access_token: token,
      token_type: 'Bearer',
      role: user.role
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.logout = async (req, res) => {
  try {
    const user = req.user;
    const token = req.token;
    if (!user || !token) return res.status(400).json({ error: 'Invalid request' });

    // remove current token
    user.tokens = user.tokens.filter(t => t !== token);
    await user.save();
    res.json({ message: 'Logged out successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.registerReceptionist = async (req, res) => {
  try {
    // only admin/Manager allowed by route middleware
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'name, email, password required' });

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: 'Email already in use' });

    const receptionist = new User({ name, email, password, role: 'Receptionist' });
    await receptionist.save();

    res.status(201).json({ message: 'Receptionist created successfully', receptionist: { id: receptionist._id, name: receptionist.name, email: receptionist.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};
