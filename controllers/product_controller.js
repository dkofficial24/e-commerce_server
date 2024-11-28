const Product = require('../models/product');

// Get all products
const getProducts = async (req, res, next) => {
  try {
    const products = await Product.find().populate('categoryId'); // Populate categoryId if it's a reference
    res.json(products);
  } catch (error) {
    next(error); // Pass the error to the error handler
  }
};

// Get product by ID
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate('categoryId'); // Populate categoryId if needed
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
    const {
      id, // Optional
      name,
      price,
      image, // Optional
      description,
      discountAmount, // Optional
      categoryId,
      stock,
      created, // Optional
      modified, // Optional
    } = req.body;

    const product = new Product({
      id,
      name,
      price,
      image,
      description,
      discountAmount,
      categoryId,
      stock,
      created: created || Date.now(), // Use current timestamp if not provided
      modified: modified || Date.now(), // Use current timestamp if not provided
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    next(error); // Pass the error to the error handler
  }
};

// Update a product
const updateProduct = async (req, res, next) => {
  try {
    const {
      id, // Optional
      name,
      price,
      image, // Optional
      description,
      discountAmount, // Optional
      categoryId,
      stock,
      modified, // Optional
    } = req.body;

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        id,
        name,
        price,
        image,
        description,
        discountAmount,
        categoryId,
        stock,
        modified: modified || Date.now(), // Update modified timestamp if not provided
      },
      { new: true } // Return the updated product
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
