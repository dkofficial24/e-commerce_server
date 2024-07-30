const Product = require('../models/product');

const getProducts = async (req, res) => {
  const products = await Product.find().populate('category');
  res.json(products);
};

const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id).populate('category');
  res.json(product);
};

const addProduct = async (req, res) => {
  const { name, description, price, category } = req.body;
  const product = new Product({ name, description, price, category });
  await product.save();
  res.status(201).json(product);
};

const updateProduct = async (req, res) => {
  const { name, description, price, category } = req.body;
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { name, description, price, category },
    { new: true }
  );
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  res.json(product);
};

const deleteProduct = async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  res.json({ message: 'Product deleted successfully' });
};

module.exports = {
  getProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
};
