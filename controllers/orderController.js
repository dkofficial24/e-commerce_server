const Order = require('../models/order');  // Import the Order model
const Cart = require('../models/cart');    // Import the Cart model
const Product = require('../models/product'); // Import the Product model

// Place Order

const placeOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { items, shippingAddress } = req.body;

    // Check if items exist
    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No items provided in the order' });
    }

    // Fetch product details for each item in the order
    const productDetails = await Product.find({ '_id': { $in: items.map(item => item.product) } });

    // Ensure all products exist
    const orderItems = items.map(item => {
      const product = productDetails.find(prod => prod._id.toString() === item.product);
      
      // If product is not found, return an error
      if (!product) {
        throw new Error(`Product not found: ${item.product}`);
      }

      // Calculate totalPrice for the item
      const discountAmount = product.discountAmount || 0;
      const priceAfterDiscount = product.price - discountAmount;
      const totalPrice = priceAfterDiscount * item.quantity;

      return {
        product: item.product,
        name: product.name,
        quantity: item.quantity,
        price: product.price,
        discountAmount,
        totalPrice,
      };
    });

    // Calculate total amount for the order
    const totalAmount = orderItems.reduce((sum, item) => sum + item.totalPrice, 0);

    // Create the order
    const order = new Order({
      orderNumber: `ORD-${Date.now()}`,
      user: userId,
      items: orderItems,
      totalAmount,
      shippingAddress,
    });

    // Save the order
    await order.save();

    res.status(201).json({ message: 'Order placed successfully', order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || 'Error placing order' });
  }
};

module.exports = { placeOrder };


// Get User Orders
const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await Order.find({ user: userId });

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: 'No orders found for this user' });
    }

    res.json({ orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching orders' });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params; // 'id' is the orderNumber in your case
    const { status } = req.body;

    // Find the order by orderNumber (not by default _id)
    const order = await Order.findOne({ orderNumber: id });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Update order status
    order.status = status;
    await order.save();

    res.json({ message: 'Order status updated successfully', order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || 'Error updating order status' });
  }
};


module.exports = {
  placeOrder,
  getUserOrders,
  updateOrderStatus
};
