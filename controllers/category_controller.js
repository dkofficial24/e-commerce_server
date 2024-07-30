const Category = require('../models/category');

const getCategories = async (req, res) => {
  const categories = await Category.find();
  res.json(categories);
};

const getCategoryById = async (req, res) => {
  const category = await Category.findById(req.params.id);
  res.json(category);
};

const addCategory = async (req, res) => {
  const { name } = req.body;
  const category = new Category({ name });
  await category.save();
  res.status(201).json(category);
};

const updateCategory = async (req, res) => {
  const { name } = req.body;
  const category = await Category.findByIdAndUpdate(
    req.params.id,
    { name },
    { new: true }
  );
  if (!category) {
    return res.status(404).json({ message: 'Category not found' });
  }
  res.json(category);
};

const deleteCategory = async (req, res) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) {
    return res.status(404).json({ message: 'Category not found' });
  }
  res.json({ message: 'Category deleted successfully' });
};

module.exports = {
  getCategories,
  getCategoryById,
  addCategory,
  updateCategory,
  deleteCategory,
};
