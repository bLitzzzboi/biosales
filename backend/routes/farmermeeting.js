const express = require('express')
const {
    getFarmerMeetings,
    getFarmerMeetingsAdmin,
    getFarmerMeeting,
    createFarmerMeeting,
    deleteFarmerMeeting,
    updateFarmerMeeting
} = require('../controllers/farmermeetingController')
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

// require auth for all farmermeeting routes
router.use(requireAuth)

// GET all farmermeetings
router.get('/', getFarmerMeetings)

// GET all farmermeetings for admin
router.get('/admin', getFarmerMeetingsAdmin)

//GET a single farmermeeting
router.get('/:id', getFarmerMeeting)

// POST a new farmermeeting
router.post('/', createFarmerMeeting)

// DELETE a farmermeeting
router.delete('/:id', deleteFarmerMeeting)

// UPDATE a farmermeeting
router.patch('/:id', updateFarmerMeeting)


module.exports = router