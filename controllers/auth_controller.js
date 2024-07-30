const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Helper function to handle errors
const handleError = (res, error, statusCode = 500) => {
  console.error('Error:', error);
  res.status(statusCode).json({ message: error.message });
};

const registerUser = async (req, res, next) => {
  try {
    console.log('Register request');
    const { username, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Hashing');

    const user = new User({ username, password: hashedPassword });
    await user.save();

    console.log('User saved');
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    next(error); // Pass errors to the error-handling middleware
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { user: { id: user._id, username: user.username } },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (error) {
    next(error); // Pass errors to the error-handling middleware
  }
};

const getUserProfile = (req, res) => {
  res.json({ user: req.user });
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
};
