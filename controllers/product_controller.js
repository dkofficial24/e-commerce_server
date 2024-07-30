const Product = require('../models/product');

// Get all products
const getProducts = async (req, res, next) => {
  try {
    const products = await Product.find().populate('category');
    res.json(products);
  } catch (error) {
    next(error); // Pass the error to the error handler
  }
};

// Get product by ID
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate('category');
    if (!product) {
      const err = new Error('Product not found');
      err.status = 404;
      throw err;
    }
    res.json(product);
  } catch (error) {
    next(error); // Pass the error to the error handler
  }
};

// Add a new product
const addProduct = async (req, res, next) => {
  try {
    const { name, description, price, category } = req.body;
    const product = new Product({ name, description, price, category });
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    next(error); // Pass the error to the error handler
  }
};

// Update a product
const updateProduct = async (req, res, next) => {
  try {
    const { name, description, price, category } = req.body;
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { name, description, price, category },
      { new: true }
    );
    if (!product) {
      const err = new Error('Product not found');
      err.status = 404;
      throw err;
    }
    res.json(product);
  } catch (error) {
    next(error); // Pass the error to the error handler
  }
};

// Delete a product
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      const err = new Error('Product not found');
      err.status = 404;
      throw err;
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    next(error); // Pass the error to the error handler
  }
};

module.exports = {
  getProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
};
