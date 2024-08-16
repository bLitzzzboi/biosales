const Product = require('../models/productModel');
const mongoose = require('mongoose');

// get all products
const getProducts = async (req, res) => {
  const user_id = req.user._id;

  const products = await Product.find({}).sort({ createdAt: -1 });

  res.status(200).json(products);
};

// get a single product
const getProduct = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such Product' });
  }

  const product = await Product.findById(id);

  if (!product) {
    return res.status(404).json({ error: 'No such Product' });
  }

  res.status(200).json(product);
};

// create a new product
const createProduct = async (req, res) => {
  const { name, packs_in_carton, pack_sizes, policies } = req.body;

  let emptyFields = [];

  if (!name) {
    emptyFields.push('name');
  }
  if (!packs_in_carton) {
    emptyFields.push('packs_in_carton');
  }
  if (!pack_sizes || pack_sizes.length === 0) {
    emptyFields.push('pack_sizes');
  }
  if (!policies || policies.length === 0) {
    emptyFields.push('policies');
  }
  
  if (emptyFields.length > 0) {
    return res.status(400).json({ error: 'Please fill in all the fields', emptyFields });
  }

  // add document to database
  try {
    const user_id = req.user._id;
    const product = await Product.create({
      name,
      packs_in_carton,
      pack_sizes,
      policies,
      user_id
    });
    res.status(200).json(product);
  } catch (error) {
    console.log("Error creating product: ", error.message);
    res.status(400).json({ error: error.message });
  }
};

// delete a product
const deleteProduct = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such product' });
  }

  const product = await Product.findOneAndDelete({ _id: id });

  if (!product) {
    return res.status(400).json({ error: 'No such product' });
  }

  res.status(200).json(product);
};

// update a product
const updateProduct = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'Invalid Product ID' });
  }

  try {
    let product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Update product fields based on req.body
    product.name = req.body.name || product.name;
    product.packs_in_carton = req.body.packs_in_carton || product.packs_in_carton;
    product.pack_sizes = req.body.pack_sizes || product.pack_sizes;
    product.policies = req.body.policies || product.policies;

    // Save the updated product
    product = await product.save();

    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  deleteProduct,
  updateProduct
};
