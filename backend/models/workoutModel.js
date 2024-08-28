const mongoose = require('mongoose')

const Schema = mongoose.Schema

const workoutSchema = new Schema({
  user_id: {
    type: String,
    required: true
  },
  area: {
    type: String,
    required: true
  },
  full_name: {
    type: String,
    required: true
  },
  // cnic: {
  //   type: String,
  //   required: true
  // },
  designation: {
    type: String,
    required: true
  },
  contact_no: {
    type: String,
    required: true
  },
  // vehicle_number: {
  //   type: String,
  //   required: true
  // },
  // vehicle_make: {
  //   type: String,
  //   required: true
  // },
  // vehicle_model: {
  //   type: String,
  //   required: true
  // },
  sales: {
    type: Number,
    required: true
  },
  cash_returned: {
    type: Number,
    required: true
  },
  // login_code: {
  //   type: String,
  //   required: true
  // }
}, { timestamps: true })

module.exports = mongoose.model('Workout', workoutSchema)

// area, full_name, cnic, designation, 
//     contact_no, vehicle_number, vehicle_make, 
//     vehicle_model, sales, cash_returned