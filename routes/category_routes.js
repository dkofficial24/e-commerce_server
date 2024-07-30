const express = require('express');
const { getCategories, getCategoryById, addCategory, updateCategory, deleteCategory } = require('../controllers/category_controller');
const authenticateUser = require('../middlewares/authenticate_user');
const authenticateApiKey = require('../middlewares/authenticate_api_key');

const router = express.Router();

router.get('/', authenticateApiKey, getCategories);
router.get('/:id', authenticateApiKey, getCategoryById);
router.post('/', authenticateUser, authenticateApiKey, addCategory);
router.put('/:id', authenticateUser, authenticateApiKey, updateCategory);
router.delete('/:id', authenticateUser, authenticateApiKey, deleteCategory);

module.exports = router;
