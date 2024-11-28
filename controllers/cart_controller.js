const Cart = require('../models/cart');

// Helper function for error handling
const handleError = (res, error, statusCode = 500) => {
  console.error('Error:', error);
  res.status(statusCode).json({ message: error.message });
};

// Add item to cart
const addItemToCart = async (req, res, next) => {
  try {
    const { productId, quantity, price, productName, productImg, discountAmount } = req.body;
    const userId = req.user.id;

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    const itemIndex = cart.items.findIndex((item) => item.product.id === productId);

    if (itemIndex > -1) {
      // Update quantity and timestamp
      cart.items[itemIndex].quantity += quantity;
      cart.items[itemIndex].updatedAt = Date.now();
    } else {
      // Add new item
      cart.items.push({
        product: productId,
        quantity,
        price,
        productName,
        productImg,
        discountAmount,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    }

    await cart.save();
    res.status(201).json(cart);
  } catch (error) {
    handleError(res, error);
  }
};

// Fetch all cart items for a user
const fetchCartItems = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const cart = await Cart.findOne({ user: userId }).populate('items.product');

    if (!cart || cart.items.length === 0) {
      return res.status(404).json({ message: 'Cart is empty' });
    }

    res.json(cart.items);
  } catch (error) {
    handleError(res, error);
  }
};

// Update cart item quantity
const updateCartItemQuantity = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { productId, newQuantity } = req.body;

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex((item) => item.product.toString() === productId);

    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Product not found in cart' });
    }

    cart.items[itemIndex].quantity = newQuantity;
    cart.items[itemIndex].updatedAt = Date.now();

    await cart.save();
    res.json(cart);
  } catch (error) {
    handleError(res, error);
  }
};

// Remove product from cart
const removeProductFromCart = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const initialItemCount = cart.items.length;
    cart.items = cart.items.filter((item) => item.product.toString() !== productId);

    if (cart.items.length === initialItemCount) {
      return res.status(404).json({ message: 'Product not found in cart' });
    }

    await cart.save();
    res.json({ message: 'Product removed from cart', cart });
  } catch (error) {
    handleError(res, error);
  }
};

// Clear cart for a user
const clearUserCart = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = [];
    await cart.save();

    res.json({ message: 'Cart cleared successfully' });
  } catch (error) {
    handleError(res, error);
  }
};

module.exports = {
  addItemToCart,
  fetchCartItems,
  updateCartItemQuantity,
  removeProductFromCart,
  clearUserCart,
};
