const User = require('../models/user'); // Assuming User model is located here

// Update Profile
const updateUserProfile = async (req, res, next) => {
  try {
    const { name, email, mobile, dob } = req.body;
    const userId = req.user.id;  // Get the user ID from the authenticated user

    // Find and update user details
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.mobile = mobile || user.mobile;
    user.dob = dob || user.dob;

    // Save updated user profile
    await user.save();

    res.status(200).json({ message: 'Profile updated successfully', user: user });
  } catch (error) {
    next(error); // Pass errors to the error-handling middleware
  }
};

// Update Shipping Address
const updateShippingAddress = async (req, res, next) => {
  try {
    const { street, city, state, postalCode, country } = req.body;
    const userId = req.user.id;  // Get the user ID from the authenticated user

    // Find and update the shipping address
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.shippingAddress = {
      street,
      city,
      state,
      postalCode,
      country,
    };

    await user.save();

    res.status(200).json({ message: 'Shipping address updated successfully', shippingAddress: user.shippingAddress });
  } catch (error) {
    next(error); // Pass errors to the error-handling middleware
  }
};

const getUserProfile = async (req, res, next) => {
    try {
      const userId = req.user.id;  // Get the user ID from the authenticated user
  
      // Find the user by their ID and explicitly select the fields you need
      const user = await User.findById(userId).select('name email mobile dob shippingAddress');  // Explicitly include the fields
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Return user profile
      res.status(200).json({ message: 'User profile retrieved successfully', user });
    } catch (error) {
      next(error); // Pass errors to the error-handling middleware
    }
  };
  

module.exports = {
  updateUserProfile,
  updateShippingAddress,
  getUserProfile
};
