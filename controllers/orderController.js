const Order = require('../models/order');
const Cart = require('../models/cart');

const placeOrder = async (req, res) => {
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
};

const getUserOrders = async (req, res) => {
  const userId = req.user.id;
  const orders = await Order.find({ user: userId }).populate('items.product');

  if (!orders || orders.length === 0) {
    return res.status(404).json({ message: 'No orders found' });
  }

  res.json(orders);
};

const updateOrderStatus = async (req, res) => {
  const { status } = req.body;
  const orderId = req.params.id;

  const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });

  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }

  res.json(order);
};

module.exports = {
  placeOrder,
  getUserOrders,
  updateOrderStatus,
};
