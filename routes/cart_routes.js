const express = require('express');
const { addItemToCart, fetchCartItems, removeProductFromCart } = require('../controllers/cart_controller');
const authenticateUser = require('../middlewares/authenticate_user');
const authenticateApiKey = require('../middlewares/authenticate_api_key');

const router = express.Router();

router.post('/', authenticateUser, authenticateApiKey, addItemToCart);
router.get('/', authenticateUser, authenticateApiKey, fetchCartItems);
router.delete('/:itemId', authenticateUser, authenticateApiKey, removeProductFromCart);

module.exports = router;
