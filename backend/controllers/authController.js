const User = require('../models/User.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// Register a new user (e.g., Admin creating a Field Officer)
// POST /api/auth/register
// @access  Public (or Protected/Admin)
const registerUser = async (req, res) => {
  const {name, email, password, role} = req.body;

  // Validate required fields
  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try { // Check if user exists
    const userExists = await User.findOne({email});
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }
    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role,
      isDemo: email.includes('demo') ? true : false,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({message: 'Invalid user data'});
    }
  } catch (error) {
    res.status(500).json({message: error.message});
  }
};


// Authenticate user & get token
// POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const {email, password} = req.body;

  try { // Check for user
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get user profile
// GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  // req.user is set by the protect middleware
  res.status(200).json(req.user);
  };
  


module.exports = {registerUser, loginUser, getMe};