const Workout = require('../models/workoutModel')
const mongoose = require('mongoose')

// get all workouts
const getWorkouts = async (req, res) => {
  const user_id = req.user._id

  const workouts = await Workout.find({user_id}).sort({createdAt: -1})

  res.status(200).json(workouts)
}

const getWorkoutsAdmin = async (req, res) => {
  // const user_id = req.user._id

  const workouts = await Workout.find({}).sort({createdAt: -1})

  res.status(200).json(workouts)
}

// get a single workout
const getWorkout = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({error: 'No such workout'})
  }

  const workout = await Workout.findById(id)

  if (!workout) {
    return res.status(404).json({error: 'No such workout'})
  }
  
  res.status(200).json(workout)
}


// create new workout
const createWorkout = async (req, res) => {
  const {area, full_name, 
    // cnic, 
    designation, 
    contact_no, 
    // vehicle_number, vehicle_make, 
    // vehicle_model, 
    sales, cash_returned} = req.body

  let emptyFields = []

  if(!area) {
    emptyFields.push('area')
  }
  if(!full_name) {
    emptyFields.push('full_name')
  }
  // if(!cnic) {
  //   emptyFields.push('cnic')
  // }
  if(!designation) {
    emptyFields.push('designation')
  }
  if(!contact_no) {
    emptyFields.push('contact_no')
  }
  // if(!vehicle_number) {
  //   emptyFields.push('vehicle_number')
  // }
  // if(!vehicle_make) {
  //   emptyFields.push('vehicle_make')
  // }
  // if(!vehicle_model) {
  //   emptyFields.push('vehicle_model')
  // }
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
    const workout = await Workout.create({area, full_name, 
      // cnic, 
      designation, 
      contact_no, 
      // vehicle_number, vehicle_make, 
      // vehicle_model, 
      sales, cash_returned, user_id})
    res.status(200).json(workout)
  } catch (error) {
    res.status(400).json({error: error.message})
  }
}

// delete a workout
const deleteWorkout = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({error: 'No such workout'})
  }

  const workout = await Workout.findOneAndDelete({_id: id})

  if (!workout) {
    return res.status(400).json({error: 'No such workout'})
  }

  res.status(200).json(workout)
}

// update a workout
const updateWorkout = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'Invalid workout ID' });
  }

  try {
    // Check if the workout exists
    let workout = await Workout.findById(id);

    if (!workout) {
      return res.status(404).json({ error: 'Workout not found' });
    }

    const fieldsToUpdate = [
      'area', 'full_name', 
      // 'cnic', 
      'designation', 
    'contact_no', 
    // 'vehicle_number', 'vehicle_make', 
    // 'vehicle_model', 
    'sales', 'cash_returned',
    ];

    fieldsToUpdate.forEach(field => {
      if (req.body[field] !== undefined) {
        workout[field] = req.body[field];
      }
    });

    // Save the updated workout
    workout = await workout.save();

    res.status(200).json(workout);
    
    
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


module.exports = {
  getWorkouts,
  getWorkoutsAdmin,
  getWorkout,
  createWorkout,
  deleteWorkout,
  updateWorkout
}