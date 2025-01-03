const Category = require("../models/category");

const getCategory = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createCategory = async (req, res) => {
  try {
    const categories = new Category(req.body);
    await categories.save();
    res.status(201).json(categories);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { getCategory, createCategory };
