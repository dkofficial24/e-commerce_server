const mongoose = require('mongoose');

const shippingAddressSchema = new mongoose.Schema({
  street: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  postalCode: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true, // Password is optional during registration
  },
  mobile: {
    type: String,
    required: false, // Mobile is optional during registration
  },
  dob: {
    type: Date,
    required: false, // DOB is optional during registration
  },
  shippingAddress: shippingAddressSchema, // Embedding the shipping address schema
}, {
  timestamps: true,
});

// Define the User model
const User = mongoose.model('User', userSchema);

module.exports = User;
