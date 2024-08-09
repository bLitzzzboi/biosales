const Receipt = require('../models/receiptModel')
const mongoose = require('mongoose')

// get all workouts
const getReceipts = async (req, res) => {
  const user_id = req.user._id

  const receipts = await Receipt.find({user_id}).sort({createdAt: -1})

  res.status(200).json(receipts)
}

const getReceiptsAdmin = async (req, res) => {
  const user_id = req.user._id

  const receipts = await Receipt.find({}).sort({createdAt: -1})

  res.status(200).json(receipts)
}

// get a single workout
const getReceipt = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({error: 'No such Receipt'})
  }

  const receipt = await Receipt.findById(id)

  if (!receipt) {
    return res.status(404).json({error: 'No such Receipt'})
  }
  
  res.status(200).json(receipt)
}


// create new workout
const createReceipt = async (req, res) => {
  const {sales_officer, status, dealer, amount, bank, deposit_slip_no, depositslip_img} = req.body

  let emptyFields = []

  if(!sales_officer) {
    emptyFields.push('sales_officer')
  }
  if(!status) {
    emptyFields.push('status')
  }
  if(!dealer) {
    emptyFields.push('dealer')
  }
  if(!amount) {
    emptyFields.push('amount')
  }
  if(!bank) {
    emptyFields.push('bank')
  }
  if(!deposit_slip_no) {
    emptyFields.push('deposit_slip_no')
  }
  if(!depositslip_img) {
    emptyFields.push('depositslip_img')
  }
  if(emptyFields.length > 0) {
    return res.status(400).json({ error: 'Please fill in all the fields', emptyFields })
  }

  // add doc to db
  try {
    const user_id = req.user._id
    const receipt = await Receipt.create({sales_officer, status, dealer, amount, bank, deposit_slip_no,depositslip_img, user_id})
    res.status(200).json(receipt)
  } catch (error) {
    console.log("Error creating receipt: ", error.message)
    res.status(400).json({error: error.message})
  }
}

// delete a workout
const deleteReceipt = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({error: 'No such receipt'})
  }

  const receipt = await Receipt.findOneAndDelete({_id: id})

  if (!receipt) {
    return res.status(400).json({error: 'No such receipt'})
  }

  res.status(200).json(receipt)
}

// update a workout
const updateReceipt = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'Invalid Receipt ID' });
  }

  try {
    // Check if the workout exists
    let receipt = await Receipt.findById(id);

    if (!receipt) {
      return res.status(404).json({ error: 'Receipt not found' });
    }

    // Update the workout fields based on req.body
    receipt.sales_officer = req.body.sales_officer;
    receipt.status = req.body.status;
    receipt.dealer = req.body.dealer;
    receipt.amount = req.body.amount;
    receipt.bank = req.body.bank;
    receipt.deposit_slip_no = req.body.deposit_slip_no;
    receipt.depositslip_img = req.body.depositslip_img;


    // Save the updated workout
    receipt = await receipt.save();

    res.status(200).json(receipt);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


module.exports = {
    getReceipts,
    getReceiptsAdmin,
    getReceipt,
    createReceipt,
    deleteReceipt,
    updateReceipt
}