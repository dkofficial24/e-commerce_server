const express = require('express');
const {
  getProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const authenticateUser = require('../middlewares/authenticate_user');
const authenticateApiKey = require('../middlewares/authenticate_api_key');

const router = express.Router();

router.get('/', authenticateApiKey, getProducts);
router.get('/:id', authenticateApiKey, getProductById);
router.post('/', authenticateUser, authenticateApiKey, addProduct);
router.put('/:id', authenticateUser, authenticateApiKey, updateProduct);
router.delete('/:id', authenticateUser, authenticateApiKey, deleteProduct);
``
module.exports = router;
