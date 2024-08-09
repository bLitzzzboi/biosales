const Product = require('../models/productModel')
const mongoose = require('mongoose')

// get all workouts
const getProducts = async (req, res) => {
  const user_id = req.user._id

  const products = await Product.find({}).sort({createdAt: -1})

  res.status(200).json(products)
}

// get a single workout
const getProduct = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({error: 'No such Product'})
  }

  const product = await Product.findById(id)

  if (!product) {
    return res.status(404).json({error: 'No such Product'})
  }
  
  res.status(200).json(product)
}


// create new workout
const createProduct = async (req, res) => {
  const {active_ingredient, formulation, crops, pests, 
    dosage, packs_in_carton, name, price_per_pack, 
    price_per_carton} = req.body

  let emptyFields = []

  if(!active_ingredient) {
    emptyFields.push('active_ingredient')
  }
  if(!formulation) {
    emptyFields.push('formulation')
  }
  if(!crops) {
    emptyFields.push('crops')
  }
  if(!pests) {
    emptyFields.push('pests')
  }
  if(!dosage) {
    emptyFields.push('dosage')
  }
  if(!packs_in_carton) {
    emptyFields.push('packs_in_carton')
  }
  if(!name) {
    emptyFields.push('name')
  }
  if(!price_per_pack) {
    emptyFields.push('price_per_pack')
  }
  if(!price_per_carton) {
    emptyFields.push('price_per_carton')
  }
  if(emptyFields.length > 0) {
    return res.status(400).json({ error: 'Please fill in all the fields', emptyFields })
  }

  // add doc to db
  try {
    const user_id = req.user._id
    const product = await Product.create({active_ingredient, formulation, crops, pests, 
        dosage, packs_in_carton, name, price_per_pack, 
        price_per_carton, user_id})
    res.status(200).json(product)
  } catch (error) {
    console.log("Error creating product: ", error.message)
    res.status(400).json({error: error.message})
  }
}

// delete a workout
const deleteProduct = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({error: 'No such product'})
  }

  const product = await Product.findOneAndDelete({_id: id})

  if (!product) {
    return res.status(400).json({error: 'No such product'})
  }

  res.status(200).json(product)
}

// update a workout
const updateProduct = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'Invalid Product ID' });
  }

  try {
    // Check if the workout exists
    let product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Update the workout fields based on req.body
    product.active_ingredient = req.body.active_ingredient;
    product.formulation = req.body.formulation;
    product.crops = req.body.crops;
    product.pests = req.body.pests;
    product.dosage = req.body.dosage;
    product.packs_in_carton = req.body.packs_in_carton;
    product.name = req.body.name;
    product.price_per_pack = req.body.price_per_pack;
    product.price_per_carton = req.body.price_per_carton;


    // Save the updated workout
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
}