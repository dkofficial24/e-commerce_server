const express = require('express');
const { 
  getProducts, 
  getProductById, 
  addProduct, 
  updateProduct, 
  deleteProduct 
} = require('../controllers/product_controller');
const authenticateUser = require('../middlewares/authenticate_user');
const authenticateApiKey = require('../middlewares/authenticate_api_key');

const router = express.Router();

// Fetch all products
router.get('/', authenticateApiKey, getProducts);

// Fetch a product by its ID
router.get('/:id', authenticateApiKey, getProductById);

// Add a new product (requires authentication)
router.post('/', authenticateUser, authenticateApiKey, addProduct);

// Update an existing product by ID (requires authentication)
router.put('/:id', authenticateUser, authenticateApiKey, updateProduct);

// Delete a product by ID (requires authentication)
router.delete('/:id', authenticateUser, authenticateApiKey, deleteProduct);

module.exports = router;
