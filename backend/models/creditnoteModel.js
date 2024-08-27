const mongoose = require('mongoose')

const Schema = mongoose.Schema

// sales_officer, area, description, km_done, location 

const creditnoteSchema = new Schema({
  user_id: {
    type: String,
    required: true
  },
  dealer_id: {
    type: String,
    required: true
  },
  policy: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  description : {
    type: String,
    required: true
  },
}, { timestamps: true })

module.exports = mongoose.model('CreditNote', creditnoteSchema)

// area, full_name, cnic, designation, 
//     contact_no, vehicle_number, vehicle_make, 
//     vehicle_model, sales, cash_returned