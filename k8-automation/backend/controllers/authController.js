// controllers/authController.js — Authentication: register, login, logout
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// ─── @route   POST /api/auth/register ───────────────────────────────────────
// ─── @access  Public
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and password.' });
    }

    // Check if email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered.' });
    }

    // Create user (password auto-hashed via pre-save hook)
    const user = await User.create({ name, email, password });

    // Generate JWT and store in DB
    const token = generateToken(user._id);
    user.token = token;
    await user.save({ validateBeforeSave: false });

    res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─── @route   POST /api/auth/login ──────────────────────────────────────────
// ─── @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password.' });
    }

    // Find user with password field (normally excluded)
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    // Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    // Generate new JWT and update in DB
    const token = generateToken(user._id);
    user.token = token;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: 'Login successful.',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─── @route   POST /api/auth/logout ─────────────────────────────────────────
// ─── @access  Private
const logout = async (req, res, next) => {
  try {
    // Clear token from DB — invalidates the session
    req.user.token = null;
    await req.user.save({ validateBeforeSave: false });

    res.status(200).json({ success: true, message: 'Logged out successfully.' });
  } catch (error) {
    next(error);
  }
};

// ─── @route   GET /api/auth/me ───────────────────────────────────────────────
// ─── @access  Private
const getMe = async (req, res) => {
  res.status(200).json({ success: true, data: req.user });
};

module.exports = { register, login, logout, getMe };
