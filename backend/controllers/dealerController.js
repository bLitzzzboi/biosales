const Dealer = require('../models/dealerModel')
const mongoose = require('mongoose')

// get all workouts
const getDealers = async (req, res) => {
  const user_id = req.user._id

  const dealers = await Dealer.find({user_id}).sort({createdAt: -1})

  res.status(200).json(dealers)
}

const getDealersAdmin = async (req, res) => {
  const user_id = req.user._id

  const dealers = await Dealer.find({}).sort({createdAt: -1})

  res.status(200).json(dealers)
}

// get a single workout
const getDealer = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({error: 'No such Dealer'})
  }

  const dealer = await Dealer.findById(id)

  if (!dealer) {
    return res.status(404).json({error: 'No such Dealer'})
  }
  
  res.status(200).json(dealer)
}


// create new workout
const createDealer = async (req, res) => {
  const {sales_officer, business_name, personal_name, 
    cnic_front_img, cnic_back_img, licence_img, address, contact_no,
    sales, cash_returned
  } = req.body

  let emptyFields = []

  if(!sales_officer) {
    emptyFields.push('sales_officer')
  }
  if(!business_name) {
    emptyFields.push('business_name')
  }
  if(!personal_name) {
    emptyFields.push('personal_name')
  }
  if(!cnic_front_img) {
    emptyFields.push('cnic_front_img')
  }
  if(!cnic_back_img) {
    emptyFields.push('cnic_back_img')
  }
  if(!licence_img) {
    emptyFields.push('licence_img')
  }
  if(!address) {
    emptyFields.push('address')
  }
  if(!contact_no) {
    emptyFields.push('contact_no')
  }
  if(!sales) {
    emptyFields.push('sales')
  }
  if(!cash_returned) {
    emptyFields.push('cash_returned')
  }
  if(emptyFields.length > 0) {
    return res.status(400).json({ error: 'Please fill in all the fields', emptyFields })
  }

  // add doc to db
  try {
    const user_id = req.user._id
    const dealer = await Dealer.create({sales_officer, business_name, personal_name, 
        cnic_front_img, cnic_back_img, licence_img, address, contact_no, sales, cash_returned,
         user_id})
    res.status(200).json(dealer)
  } catch (error) {
    console.log("Error creating dealer: ", error.message)
    res.status(400).json({error: error.message})
  }
}

// delete a workout
const deleteDealer = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({error: 'No such dealer'})
  }

  const dealer = await Dealer.findOneAndDelete({_id: id})

  if (!dealer) {
    return res.status(400).json({error: 'No such dealer'})
  }

  res.status(200).json(dealer)
}

// update a workout
const updateDealer = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'Invalid Dealer ID' });
  }

  try {
    // Check if the workout exists
    let dealer = await Dealer.findById(id);

    if (!dealer) {
      return res.status(404).json({ error: 'Dealer not found' });
    }

    // Update the workout fields based on req.body

    // sales_officer, business_name, personal_name, 
    // cnic_front_img, cnic_back_img, licence_img, address, contact_no
    
    dealer.sales_officer = req.body.sales_officer;
    dealer.business_name = req.body.business_name;
    dealer.personal_name = req.body.personal_name;
    dealer.cnic_front_img = req.body.cnic_front_img;
    dealer.cnic_back_img = req.body.cnic_back_img;
    dealer.licence_img = req.body.licence_img;
    dealer.address = req.body.address;
    dealer.contact_no = req.body.contact_no;
    dealer.sales = req.body.sales;
    dealer.cash_returned = req.body.cash_returned;


    // Save the updated workout
    dealer = await dealer.save();

    res.status(200).json(dealer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


module.exports = {
    getDealers,
    getDealersAdmin,
    getDealer,
    createDealer,
    deleteDealer,
    updateDealer
}