const express = require('express')
const {
    getVisits,
    getVisit,
    createVisit,
    deleteVisit,
    updateVisit
} = require('../controllers/visitController')
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

// require auth for all visit routes
router.use(requireAuth)

// GET all visits
router.get('/', getVisits)

//GET a single visit
router.get('/:id', getVisit)

// POST a new visit
router.post('/', createVisit)

// DELETE a visit
router.delete('/:id', deleteVisit)

// UPDATE a visit
router.patch('/:id', updateVisit)


module.exports = router