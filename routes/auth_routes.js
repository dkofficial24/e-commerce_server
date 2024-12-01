const express = require('express');
const { registerUser, loginUser, getUserProfile } = require('../controllers/auth_controller'); // Ensure getUserProfile is imported
const { updateUserProfile, updateShippingAddress } = require('../controllers/user_controller');
const authenticateUser = require('../middlewares/authenticate_user');
const authenticateApiKey = require('../middlewares/authenticate_api_key');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', authenticateUser, authenticateApiKey, getUserProfile); // This will work now
router.put('/profile', authenticateUser, authenticateApiKey, updateUserProfile);
router.put('/shipping-address', authenticateUser, authenticateApiKey, updateShippingAddress);  // New route for updating shipping address

module.exports = router;
