const Cart = require('../models/cart');

// Helper function for error handling
const handleError = (res, error, statusCode = 500) => {
  console.error('Error:', error);
  res.status(statusCode).json({ message: error.message });
};

// Add item to cart
const addItemToCart = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;  // Removed productName, productImg, and discountAmount
    const userId = req.user.id;

    // Find the user's cart
    let cart = await Cart.findOne({ user: userId });

    // If no cart found, create a new one
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    // Check if the product is already in the cart
    const itemIndex = cart.items.findIndex((item) => item.product.toString() === productId);
    console.log("addItemCart index: " + itemIndex);

    if (itemIndex > -1) {
      // Update the quantity if the item already exists in the cart
      cart.items[itemIndex].quantity += quantity;
      cart.items[itemIndex].updatedAt = Date.now();
    } else {
      // Add new item to the cart
      cart.items.push({
        product: productId,
        quantity,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    }

    // Save the updated cart
    await cart.save();
    res.status(201).json({ message: 'Item added to cart successfully', cart });
  } catch (error) {
    handleError(res, error);
  }
};


const fetchCartItems = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const cart = await Cart.findOne({ user: userId }).populate('items.product');

    if (!cart || cart.items.length === 0) {
      return res.status(404).json({ message: 'Cart is empty' });
    }

    // Filter out products that no longer exist in the catalog
    const updatedItems = cart.items.filter(item => {
      return item.product !== null; // Make sure product exists
    });

    // Calculate the subtotal and total discount
    const subtotal = updatedItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
    const totalDiscount = updatedItems.reduce((total, item) => total + (item.product.discountAmount * item.quantity), 0);

    const response = {
      user: userId,
      subtotal,
      totalDiscount,
      items: updatedItems.map(item => ({
        product: {
          _id: item.product._id,
          name: item.product.name,
          image: item.product.image,
          price: item.product.price,
          discountAmount: item.product.discountAmount,
        },
        quantity: item.quantity,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      }))
    };

    // Add a warning message if some products were removed
    if (updatedItems.length < cart.items.length) {
      response.message = 'Some products in your cart are no longer available and have been removed.';
    }

    res.json(response);
  } catch (error) {
    handleError(res, error);
  }
};





const updateCartItemQuantity = async (req, res) => {
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


const removeProductFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const initialItemCount = cart.items.length;
    console.log("ProductId:"+productId);
    cart.items = cart.items.filter((item) =>{
      console.log(item.toString());
      console.log("ProductIdStr:"+item.product.toString());
      return item.product.toString() !== productId;
    });

    if (cart.items.length === initialItemCount) {
      return res.status(404).json({ message: 'Product not found in cart' });
    }

    await cart.save();
    res.json({ message: 'Product removed from cart', cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error removing product from cart' });
  }
};


const clearUserCart = async (req, res) => {
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

const updateCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity } = req.body; // Expect productId and quantity in request body

    // Validate input
    if (!productId || quantity == null) {
      return res.status(400).json({ message: 'Product ID and quantity are required' });
    }

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Find the product in the cart
    const itemIndex = cart.items.findIndex((item) => item.product.toString() === productId);

    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Product not found in cart' });
    }

    // Update the quantity
    cart.items[itemIndex].quantity = quantity;
    cart.items[itemIndex].updatedAt = Date.now();

    // Save the updated cart
    await cart.save();

    res.json({ message: 'Cart updated successfully', cart });
  } catch (error) {
    console.error('Error updating cart:', error);
    res.status(500).json({ message: 'An error occurred while updating the cart' });
  }
};





module.exports = {
  addItemToCart,
  fetchCartItems,
  updateCartItemQuantity,
  removeProductFromCart,
  clearUserCart,
  updateCart
};
