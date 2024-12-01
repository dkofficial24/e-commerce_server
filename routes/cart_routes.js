const express = require('express');
const { 
  addItemToCart, 
  fetchCartItems, 
  removeProductFromCart, 
  updateCartItemQuantity, 
  clearUserCart 
} = require('../controllers/cart_controller');
const authenticateUser = require('../middlewares/authenticate_user');
const authenticateApiKey = require('../middlewares/authenticate_api_key');

const router = express.Router();

// Add item to cart
router.post('/', authenticateUser, authenticateApiKey, addItemToCart);

// Fetch all cart items for a user
router.get('/', authenticateUser, authenticateApiKey, fetchCartItems);

// Update cart item quantity
router.patch('/:productId', authenticateUser, authenticateApiKey, updateCartItemQuantity);

// Remove a product from the cart
router.delete('/:productId', authenticateUser, authenticateApiKey, removeProductFromCart);

// Clear the entire cart for a user
router.delete('/', authenticateUser, authenticateApiKey, clearUserCart);

module.exports = router;
