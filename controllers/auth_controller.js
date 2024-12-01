const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user'); // Assuming new user schema is in 'User.js'

// Helper function to handle errors
const handleError = (res, error, statusCode = 500) => {
  console.error('Error:', error);
  res.status(statusCode).json({ message: error.message });
};

const registerUser = async (req, res, next) => {
  try {
    console.log('Register request');
    const { name, email, password, mobile, dob } = req.body;

    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Hashing password');

    // Create a new user
    const user = new User({ name, email, password: hashedPassword, mobile, dob });
    await user.save();

    console.log('User saved');
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    next(error); // Pass errors to the error-handling middleware
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if the password is valid
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create a JWT token
    const token = jwt.sign(
      { user: { id: user._id, email: user.email } },
      process.env.JWT_SECRET,
      { expiresIn: '48h' }
    );

    res.json({ token });
  } catch (error) {
    next(error); // Pass errors to the error-handling middleware
  }
};

const getUserProfile = (req, res,next) => {
  console.log("getUserProfile");
  res.json({ user: req.user });
};

const updateUserProfile = async (req, res, next) => {
  try {
    const { name, email, mobile, dob } = req.body;
    const userId = req.user.id;

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user details
    if (name) user.name = name;
    if (email) user.email = email;
    if (mobile) user.mobile = mobile;
    if (dob) user.dob = dob;

    // Save the updated user
    await user.save();

    res.status(200).json({ message: 'User profile updated successfully', user });
  } catch (error) {
    next(error); // Pass errors to the error-handling middleware
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
};
