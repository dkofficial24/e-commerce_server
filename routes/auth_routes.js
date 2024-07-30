const express = require('express');
const { registerUser, loginUser, getUserProfile } = require('../controllers/auth_controller');
const authenticateUser = require('../middlewares/authenticate_user');
const authenticateApiKey = require('../middlewares/authenticate_api_key');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', authenticateUser, authenticateApiKey, getUserProfile);

module.exports = router;
