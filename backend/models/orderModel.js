const mongoose = require('mongoose')
const { type } = require('os')

const Schema = mongoose.Schema

// sales_officer, items, dealer, policy, amount, status, bilty_invoice, bilty_receipt, truck_number, truck_name, truck_contact_no

const orderSchema = new Schema({
  user_id: {
    type: String,
    required: true
  },
  sales_officer: {
    type: String,
    required: true
  },
  items: [
    {
      "productId": String,
      "quantity": Number,
      "price": Number,
      "policy": String,
    },

  ],
  dealer: {
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
  status: {
    type: String,
    required: true
  },
  bilty_invoice: {
    type: String,
  },
  bilty_receipt: {
    type: String,
  },
  truck_number: {
    type: String,
    },
  truck_name: {
    type: String,
    },
    truck_contact_no: {
    type: String,
    },
    details_pdf: {
      type: String,
    },
}, { timestamps: true })

module.exports = mongoose.model('Order', orderSchema)

// area, full_name, cnic, designation, 
//     contact_no, vehicle_number, vehicle_make, 
//     vehicle_model, sales, cash_returned