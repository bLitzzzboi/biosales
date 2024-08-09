const Policy = require('../models/policyModel')
const mongoose = require('mongoose')

// get all workouts
const getPolicys = async (req, res) => {
  const user_id = req.user._id

  const policys = await Policy.find({}).sort({createdAt: -1})

  res.status(200).json(policys)
}

// get a single workout
const getPolicy = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({error: 'No such Policy'})
  }

  const policy = await Policy.findById(id)

  if (!policy) {
    return res.status(404).json({error: 'No such Policy'})
  }
  
  res.status(200).json(policy)
}


// create new workout
const createPolicy = async (req, res) => {
  const {policy_name, multiplier } = req.body

  let emptyFields = []

  if(!policy_name) {
    emptyFields.push('policy_name')
  }
  if(!multiplier) {
    emptyFields.push('multiplier')
  }

  if(emptyFields.length > 0) {
    return res.status(400).json({ error: 'Please fill in all the fields', emptyFields })
  }

  // add doc to db
  try {
    const user_id = req.user._id
    const policy = await Policy.create({policy_name, multiplier, user_id})
    res.status(200).json(policy)
  } catch (error) {
    console.log("Error creating Policy: ", error.message)
    res.status(400).json({error: error.message})
  }
}

// delete a workout
const deletePolicy = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({error: 'No such policy'})
  }

  const policy = await Policy.findOneAndDelete({_id: id})

  if (!policy) {
    return res.status(400).json({error: 'No such policy'})
  }

  res.status(200).json(policy)
}

// update a workout
const updatePolicy = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'Invalid Policy ID' });
  }

  try {
    // Check if the workout exists
    let policy = await Policy.findById(id);

    if (!policy) {
      return res.status(404).json({ error: 'Policy not found' });
    }

    // Update the workout fields based on req.body

    // sales_officer, farmer_name, area_of_land, address,
    //  contact_no, participant_no, total_expense
    
    policy.policy_name = req.body.policy_name;
    policy.multiplier = req.body.multiplier;


    // Save the updated workout
    policy = await policy.save();

    res.status(200).json(policy);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


module.exports = {
    getPolicys,
    getPolicy,
    createPolicy,
    deletePolicy,
    updatePolicy
}