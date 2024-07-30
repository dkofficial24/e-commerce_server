const Order = require('../models/order');
const Cart = require('../models/cart');

// Helper function to handle errors
const handleError = (res, error, statusCode = 500) => {
  console.error('Error:', error);
  res.status(statusCode).json({ message: error.message });
};

const placeOrder = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const cart = await Cart.findOne({ user: userId }).populate('items.product');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const orderItems = cart.items.map((item) => ({
      product: item.product._id,
      quantity: item.quantity,
    }));

    const totalAmount = cart.items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

    const order = new Order({
      user: userId,
      items: orderItems,
      totalAmount,
    });

    await order.save();
    await Cart.findOneAndDelete({ user: userId });

    res.status(201).json(order);
  } catch (error) {
    next(error); // Pass errors to the error-handling middleware
  }
};

const getUserOrders = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const orders = await Order.find({ user: userId }).populate('items.product');

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: 'No orders found' });
    }

    res.json(orders);
  } catch (error) {
    next(error); // Pass errors to the error-handling middleware
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const orderId = req.params.id;

    const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    next(error); // Pass errors to the error-handling middleware
  }
};

module.exports = {
  placeOrder,
  getUserOrders,
  updateOrderStatus,
};
