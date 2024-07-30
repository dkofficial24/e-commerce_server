const express = require('express');
const { placeOrder, getUserOrders, updateOrderStatus } = require('../controllers/orderController');
const authenticateUser = require('../middlewares/authenticate_user');
const authenticateApiKey = require('../middlewares/authenticate_api_key');

const router = express.Router();

router.post('/', authenticateUser, authenticateApiKey, placeOrder);
router.get('/', authenticateUser, authenticateApiKey, getUserOrders);
router.put('/:id', authenticateUser, authenticateApiKey, updateOrderStatus);

module.exports = router;
