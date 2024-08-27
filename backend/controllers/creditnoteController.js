const CreditNote = require('../models/creditnoteModel')
const mongoose = require('mongoose')

// get all workouts
const getCreditNotes = async (req, res) => {
  const user_id = req.user._id

  const creditnotes = await CreditNote.find({user_id}).sort({createdAt: -1})

  res.status(200).json(creditnotes)
}

const getCreditNotesAdmin = async (req, res) => {
  // const user_id = req.user._id

  const creditnotes = await CreditNote.find({}).sort({createdAt: -1})

  res.status(200).json(creditnotes)
}

// get a single workout
const getCreditNote = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({error: 'No such Credit Note'})
  }

  const creditnote = await CreditNote.findById(id)

  if (!creditnote) {
    return res.status(404).json({error: 'No such Credit Note'})
  }
  
  res.status(200).json(creditnote)
}


// create new workout
const createCreditNote = async (req, res) => {
  const {dealer_id, policy, amount, description } = req.body

  let emptyFields = []

  if (!dealer_id) {
    emptyFields.push('dealer_id')
    }
    if (!policy) {
    emptyFields.push('policy')
    }
    if (!amount) {
    emptyFields.push('amount')
    }
    if (!description) {
    emptyFields.push('description')
    }
  if(emptyFields.length > 0) {
    return res.status(400).json({ error: 'Please fill in all the fields', emptyFields })
  }

  // add doc to db
  try {
    const user_id = req.user._id
    const creditnote = await CreditNote.create({dealer_id, policy, amount, description, user_id})
    res.status(200).json(creditnote)
  } catch (error) {
    console.log("Error creating CN: ", error.message)
    res.status(400).json({error: error.message})
  }
}

// delete a workout
const deleteCreditNote = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({error: 'No such Credit Note'})
  }

  const creditnote = await CreditNote.findOneAndDelete({_id: id})

  if (!creditnote) {
    return res.status(400).json({error: 'No such Credit Note'})
  }

  res.status(200).json(creditnote)
}

// update a workout
const updateCreditNote = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'Invalid Credit Note ID' });
  }

  try {
    // Check if the workout exists
    let creditnote = await CreditNote.findById(id);

    if (!creditnote) {
      return res.status(404).json({ error: 'Credit Note not found' });
    }

    // Update the workout fields based on req.body

    // sales_officer, area, description, km_done, location 
    
    creditnote.dealer_id = req.body.dealer_id;
    creditnote.policy = req.body.policy;
    creditnote.amount = req.body.amount;
    creditnote.description = req.body.description;



    // Save the updated workout
    creditnote = await creditnote.save();

    res.status(200).json(creditnote);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


module.exports = {
    getCreditNotes,
    getCreditNotesAdmin,
    getCreditNote,
    createCreditNote,
    deleteCreditNote,
    updateCreditNote
}