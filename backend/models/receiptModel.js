const mongoose = require('mongoose')

const Schema = mongoose.Schema

// dealer, amount, bank, deposit_slip_no

const receiptSchema = new Schema({
  user_id: {
    type: String,
    required: true
  },
  sales_officer: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: "Unverified"
  },
  dealer: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  bank: {
    type: String,
    required: true
  },
  deposit_slip_no: {
    type: String,
    required: true
  },
  depositslip_img: {
    type: String,
    required: true
  },
}, { timestamps: true })

module.exports = mongoose.model('Receipt', receiptSchema)

// area, full_name, cnic, designation, 
//     contact_no, vehicle_number, vehicle_make, 
//     vehicle_model, sales, cash_returned