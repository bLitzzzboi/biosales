const mongoose = require('mongoose')

const Schema = mongoose.Schema

// active_ingredient, formulation, crops, pests, dosage, packs_in_carton, name, price_per_pack, price_per_carton

const productSchema = new Schema({
  user_id: {
    type: String,
    required: true
  },
  // active_ingredient: {
  //   type: String,
  //   required: true
  // },
  // formulation: {
  //   type: String,
  //   required: true
  // },
  // crops: {
  //   type: String,
  //   required: true
  // },
  // pests: {
  //   type: String,
  //   required: true
  // },
  // dosage: {
  //   type: String,
  //   required: true
  // },
  packs_in_carton: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  price_per_pack: {
    type: Number,
    required: true
  },
  price_per_carton: {
    type: Number,
    required: true
  },
}, { timestamps: true })

module.exports = mongoose.model('Product', productSchema)

// area, full_name, cnic, designation, 
//     contact_no, vehicle_number, vehicle_make, 
//     vehicle_model, sales, cash_returned