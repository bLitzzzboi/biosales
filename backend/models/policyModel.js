const mongoose = require('mongoose')

const Schema = mongoose.Schema

// sales_officer, farmer_name, area_of_land, address, contact_no, participant_no, total_expense 

const policySchema = new Schema({
  user_id: {
    type: String,
    required: true
  },
  policy_name: {
    type: String,
    required: true
  },
  multiplier: {
    type: Number,
    required: true
  },
}, { timestamps: true })

module.exports = mongoose.model('Policy', policySchema)

// area, full_name, cnic, designation, 
//     contact_no, vehicle_number, vehicle_make, 
//     vehicle_model, sales, cash_returned