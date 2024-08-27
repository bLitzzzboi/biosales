const mongoose = require('mongoose')

const Schema = mongoose.Schema

// sales_officer, area, description, km_done, location 

const visitSchema = new Schema({
  user_id: {
    type: String,
    required: true
  },
  sales_officer: {
    type: String,
    required: true
  },
  // area: {
  //   type: String,
  //   required: true
  // },
  // description: {
  //   type: String,
  //   required: true
  // },
  // km_done: {
  //   type: Number,
  //   required: true
  // },
  farmer_name: {
    type: String,
    required: true
  },
  farmer_address: {
    type: String,
    required: true
  },
  farmer_contact: {
    type: String,
    required: true
  },
  total_area : {
    type: String,
    required: true
  },
  crop : {
    type: String,
    required: true
  },
  suggestion: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
}, { timestamps: true })

module.exports = mongoose.model('Visit', visitSchema)

// area, full_name, cnic, designation, 
//     contact_no, vehicle_number, vehicle_make, 
//     vehicle_model, sales, cash_returned