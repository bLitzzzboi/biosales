const mongoose = require('mongoose')

const Schema = mongoose.Schema

// sales_officer, farmer_name, area_of_land, address, contact_no, participant_no, total_expense 

const farmermeetingSchema = new Schema({
  user_id: {
    type: String,
    required: true
  },
  sales_officer: {
    type: String,
    required: true
  },
  farmer_name: {
    type: String,
    required: true
  },
  area_of_land: {
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
  participant_no: {
    type: String,
    required: true
  },
  total_expense: {
    type: String,
    required: true
  },
  picture : {
    type: String,
    required: true
  },
}, { timestamps: true })

module.exports = mongoose.model('FarmerMeeting', farmermeetingSchema)

// area, full_name, cnic, designation, 
//     contact_no, vehicle_number, vehicle_make, 
//     vehicle_model, sales, cash_returned