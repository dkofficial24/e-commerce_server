const Cart = require('../models/cart');

const addItemToCart = async (req, res) => {
  const { product, quantity } = req.body;
  const userId = req.user.id;

  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    cart = new Cart({ user: userId, items: [] });
  }

  const itemIndex = cart.items.findIndex((item) => item.product.toString() === product);

  if (itemIndex > -1) {
    cart.items[itemIndex].quantity += quantity;
  } else {
    cart.items.push({ product, quantity });
  }

  await cart.save();
  res.status(201).json(cart);
};

const getUserCart = async (req, res) => {
  const userId = req.user.id;
  const cart = await Cart.findOne({ user: userId }).populate('items.product');

  if (!cart) {
    return res.status(404).json({ message: 'Cart not found' });
  }

  res.json(cart);
};

const removeItemFromCart = async (req, res) => {
  const userId = req.user.id;
  const itemId = req.params.itemId;

  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    return res.status(404).json({ message: 'Cart not found' });
  }

  cart.items = cart.items.filter((item) => item._id.toString() !== itemId);

  await cart.save();
  res.json(cart);
};

module.exports = {
  addItemToCart,
  getUserCart,
  removeItemFromCart,
};
