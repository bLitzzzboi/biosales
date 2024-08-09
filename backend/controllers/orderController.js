const Order = require('../models/orderModel')
const mongoose = require('mongoose')

// get all workouts
const getOrders = async (req, res) => {
  const user_id = req.user._id

  const orders = await Order.find({user_id}).sort({createdAt: -1})

  res.status(200).json(orders)
}

const getOrdersAdmin = async (req, res) => {
  const user_id = req.user._id

  const orders = await Order.find({}).sort({createdAt: -1})

  res.status(200).json(orders)
}

// get a single workout
const getOrder = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({error: 'No such Order'})
  }

  const order = await Order.findById(id)

  if (!order) {
    return res.status(404).json({error: 'No such Oder'})
  }
  
  res.status(200).json(order)
}


// create new workout
const createOrder = async (req, res) => {
  const {sales_officer, items, dealer, policy, amount, status, bilty_invoice,
     bilty_receipt, truck_number, truck_name, truck_contact_no, details_pdf} = req.body

  let emptyFields = []

  if(!sales_officer) {
    emptyFields.push('sales_officer')
  }
  if(!items) {
    emptyFields.push('items')
  }
  if(!dealer) {
    emptyFields.push('dealer')
  }
  if(!policy) {
    emptyFields.push('policy')
  }
  if(!amount) {
    emptyFields.push('amount')
  }
  if(!status) {
    emptyFields.push('status')
  }
//   if(!bilty_invoice) {
//     emptyFields.push('bilty_invoice')
//   }
//     if(!bilty_receipt) {
//     emptyFields.push('bilty_receipt')
//     }
//     if(!truck_number) {
//     emptyFields.push('truck_number')
//     }
//     if(!truck_name) {
//     emptyFields.push('truck_name')
//     }
//     if(!truck_contact_no) {
//     emptyFields.push('truck_contact_no')
//     }

  if(emptyFields.length > 0) {
    return res.status(400).json({ error: 'Please fill in all the fields', emptyFields })
  }

  // add doc to db
  try {
    const user_id = req.user._id
    const order = await Order.create({sales_officer, items, dealer, policy, amount, status, bilty_invoice,
        bilty_receipt, truck_number, truck_name, truck_contact_no,details_pdf, user_id})
    res.status(200).json(order)
  } catch (error) {
    console.log("Error creating Order: ", error.message)
    res.status(400).json({error: error.message})
  }
}

// delete a workout
const deleteOrder = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({error: 'No such Order'})
  }

  const order = await Order.findOneAndDelete({_id: id})

  if (!order) {
    return res.status(400).json({error: 'No such Order'})
  }

  res.status(200).json(order)
}

// update a workout
const updateOrder = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'Invalid Order ID' });
  }

  try {
    // Check if the order exists
    let order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Update the order fields based on req.body
    const fieldsToUpdate = [
      'sales_officer', 'items', 'dealer', 'policy', 'amount', 'status',
      'bilty_invoice', 'bilty_receipt', 'truck_number', 'truck_name', 'truck_contact_no', 'details_pdf'
    ];

    fieldsToUpdate.forEach(field => {
      if (req.body[field] !== undefined) {
        order[field] = req.body[field];
      }
    });

    // Save the updated order
    order = await order.save();

    res.status(200).json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
    getOrders,
    getOrdersAdmin,
    getOrder,
    createOrder,
    deleteOrder,
    updateOrder,
}