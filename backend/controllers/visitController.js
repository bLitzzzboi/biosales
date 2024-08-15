const Visit = require('../models/visitModel')
const mongoose = require('mongoose')

// get all workouts
const getVisits = async (req, res) => {
  const user_id = req.user._id

  const visits = await Visit.find({user_id}).sort({createdAt: -1})

  res.status(200).json(visits)
}

const getVisitsAdmin = async (req, res) => {
  // const user_id = req.user._id

  const visits = await Visit.find({}).sort({createdAt: -1})

  res.status(200).json(visits)
}

// get a single workout
const getVisit = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({error: 'No such Daily Visit'})
  }

  const visit = await Visit.findById(id)

  if (!visit) {
    return res.status(404).json({error: 'No such Daily Visit'})
  }
  
  res.status(200).json(visit)
}


// create new workout
const createVisit = async (req, res) => {
  const {sales_officer, area, description, km_done, location } = req.body

  let emptyFields = []

  if(!sales_officer) {
    emptyFields.push('sales_officer')
  }
  if(!area) {
    emptyFields.push('area')
  }
  if(!description) {
    emptyFields.push('description')
  }
  if(!km_done) {
    emptyFields.push('km_done')
  }
  if(!location) {
    emptyFields.push('location')
  }
  if(emptyFields.length > 0) {
    return res.status(400).json({ error: 'Please fill in all the fields', emptyFields })
  }

  // add doc to db
  try {
    const user_id = req.user._id
    const visit = await Visit.create({sales_officer, area, description, km_done, location, user_id})
    res.status(200).json(visit)
  } catch (error) {
    console.log("Error creating Visit: ", error.message)
    res.status(400).json({error: error.message})
  }
}

// delete a workout
const deleteVisit = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({error: 'No such Daily Visit'})
  }

  const visit = await Visit.findOneAndDelete({_id: id})

  if (!visit) {
    return res.status(400).json({error: 'No such Daily Visit'})
  }

  res.status(200).json(visit)
}

// update a workout
const updateVisit = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'Invalid Daily Visit ID' });
  }

  try {
    // Check if the workout exists
    let visit = await Visit.findById(id);

    if (!visit) {
      return res.status(404).json({ error: 'Daily Visit not found' });
    }

    // Update the workout fields based on req.body

    // sales_officer, area, description, km_done, location 
    
    visit.sales_officer = req.body.sales_officer;
    visit.area = req.body.area;
    visit.description = req.body.description;
    visit.km_done = req.body.km_done;
    visit.location = req.body.location;


    // Save the updated workout
    visit = await visit.save();

    res.status(200).json(visit);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


module.exports = {
    getVisits,
    getVisitsAdmin,
    getVisit,
    createVisit,
    deleteVisit,
    updateVisit
}