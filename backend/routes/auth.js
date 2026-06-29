const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// Helper function to generate JWT token with User ID
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d' // Token expires in 30 days
  });
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  // Validate inputs
  if (!username || !email || !password) {
    return res.status(400).json({ success: false, message: 'Please fill in all fields' });
  }

  try {
    // Check if email already registered
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ success: false, message: 'User with this email already exists' });
    }

    // Check if username already taken
    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      return res.status(400).json({ success: false, message: 'Username is already taken' });
    }

    // Create user in DB (password will be automatically hashed in pre-save middleware)
    const user = await User.create({
      username,
      email,
      password
    });

    if (user) {
      return res.status(201).json({
        success: true,
        message: 'Registration successful',
        user: {
          id: user._id,
          username: user.username,
          email: user.email
        },
        token: generateToken(user._id)
      });
    } else {
      return res.status(400).json({ success: false, message: 'Invalid user data received' });
    }
  } catch (error) {
    console.error('Registration API Error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error during registration. Please try again.' });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user and get token
// @access  Public
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Validate inputs
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Please fill in all fields' });
  }

  try {
    // Find user by email
    const user = await User.findOne({ email });

    // Validate email and matching password
    if (user && (await user.matchPassword(password))) {
      return res.json({
        success: true,
        message: 'Login successful',
        user: {
          id: user._id,
          username: user.username,
          email: user.email
        },
        token: generateToken(user._id)
      });
    } else {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Login API Error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error during login. Please try again.' });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user profile (useful to check active login state)
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    // req.user was populated in the protect middleware
    return res.json({
      success: true,
      user: req.user
    });
  } catch (error) {
    console.error('Profile API Error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
