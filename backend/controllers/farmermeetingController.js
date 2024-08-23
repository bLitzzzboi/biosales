const FarmerMeeting = require('../models/farmermeetingModel')
const mongoose = require('mongoose')

// get all workouts
const getFarmerMeetings = async (req, res) => {
  const user_id = req.user._id

  const farmermeetings = await FarmerMeeting.find({user_id}).sort({createdAt: -1})

  res.status(200).json(farmermeetings)
}

const getFarmerMeetingsAdmin = async (req, res) => {
  // const user_id = req.user._id

  const farmermeetings = await FarmerMeeting.find({}).sort({createdAt: -1})

  res.status(200).json(farmermeetings)
}

// get a single workout
const getFarmerMeeting = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({error: 'No such Farmer Meeting'})
  }

  const farmermeeting = await FarmerMeeting.findById(id)

  if (!farmermeeting) {
    return res.status(404).json({error: 'No such Farmer Meeting'})
  }
  
  res.status(200).json(farmermeeting)
}


// create new workout
const createFarmerMeeting = async (req, res) => {
  const {sales_officer, farmer_name, area_of_land, address,
     contact_no, participant_no, total_expense } = req.body

  let emptyFields = []

  if(!sales_officer) {
    emptyFields.push('sales_officer')
  }
  if(!farmer_name) {
    emptyFields.push('farmer_name')
  }
  if(!area_of_land) {
    emptyFields.push('area_of_land')
  }
  if(!address) {
    emptyFields.push('address')
  }
  if(!contact_no) {
    emptyFields.push('contact_no')
  }
  if(!participant_no) {
    emptyFields.push('participant_no')
  }
  if(!total_expense) {
    emptyFields.push('total_expense')
  }
  if(emptyFields.length > 0) {
    return res.status(400).json({ error: 'Please fill in all the fields', emptyFields })
  }

  // add doc to db
  try {
    const user_id = req.user._id
    const farmermeeting = await FarmerMeeting.create({sales_officer, farmer_name, area_of_land, address,
        contact_no, participant_no, total_expense,meeting_photo, user_id})
    res.status(200).json(farmermeeting)
  } catch (error) {
    console.log("Error creating Farmer Meeting: ", error.message)
    res.status(400).json({error: error.message})
  }
}

// delete a workout
const deleteFarmerMeeting = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({error: 'No such farmer meeting'})
  }

  const farmermeeting = await FarmerMeeting.findOneAndDelete({_id: id})

  if (!farmermeeting) {
    return res.status(400).json({error: 'No such farmer meeting'})
  }

  res.status(200).json(farmermeeting)
}

// update a workout
const updateFarmerMeeting = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'Invalid Farmer Meeting ID' });
  }

  try {
    // Check if the workout exists
    let farmermeeting = await FarmerMeeting.findById(id);

    if (!farmermeeting) {
      return res.status(404).json({ error: 'Farmer Meeting not found' });
    }

    // Update the workout fields based on req.body

    // sales_officer, farmer_name, area_of_land, address,
    //  contact_no, participant_no, total_expense
    
    farmermeeting.sales_officer = req.body.sales_officer;
    farmermeeting.farmer_name = req.body.farmer_name;
    farmermeeting.area_of_land = req.body.area_of_land;
    farmermeeting.address = req.body.address;
    farmermeeting.contact_no = req.body.contact_no;
    farmermeeting.participant_no = req.body.participant_no;
    farmermeeting.total_expense = req.body.total_expense;


    // Save the updated workout
    farmermeeting = await farmermeeting.save();

    res.status(200).json(farmermeeting);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


module.exports = {
    getFarmerMeetings,
    getFarmerMeetingsAdmin,
    getFarmerMeeting,
    createFarmerMeeting,
    deleteFarmerMeeting,
    updateFarmerMeeting
}