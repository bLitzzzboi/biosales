const mongoose = require('mongoose')

const Schema = mongoose.Schema

// sales_officer, business_name, personal_name, cnic_front_img, cnic_back_img, licence_img, address, contact_no

const dealerSchema = new Schema({
  user_id: {
    type: String,
    required: true
  },
  sales_officer: {
    type: String,
    required: true
  },
  business_name: {
    type: String,
    required: true
  },
  personal_name: {
    type: String,
    required: true
  },
  cnic_front_img: {
    type: String,
    required: true
  },
  cnic_back_img: {
    type: String,
    required: true
  },
  licence_img: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  contact_no: {
    type: String,
    required: true
  },
}, { timestamps: true })

module.exports = mongoose.model('Dealer', dealerSchema)

// area, full_name, cnic, designation, 
//     contact_no, vehicle_number, vehicle_make, 
//     vehicle_model, sales, cash_returned