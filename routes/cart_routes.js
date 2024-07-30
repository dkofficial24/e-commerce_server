const express = require('express');
const { addItemToCart, getUserCart, removeItemFromCart } = require('../controllers/cart_controller');
const authenticateUser = require('../middlewares/authenticate_user');
const authenticateApiKey = require('../middlewares/authenticate_api_key');

const router = express.Router();

router.post('/', authenticateUser, authenticateApiKey, addItemToCart);
router.get('/', authenticateUser, authenticateApiKey, getUserCart);
router.delete('/:itemId', authenticateUser, authenticateApiKey, removeItemFromCart);

module.exports = router;
