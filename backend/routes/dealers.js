const express = require('express')
const {
    getDealers,
    getDealersAdmin,
    getDealer,
    createDealer,
    deleteDealer,
    updateDealer
} = require('../controllers/dealerController')
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

// require auth for all dealer routes
router.use(requireAuth)

// GET all dealers
router.get('/', getDealers)

// GET all dealers for admin
router.get('/admin', getDealersAdmin)

//GET a single dealer
router.get('/:id', getDealer)

// POST a new dealer
router.post('/', createDealer)

// DELETE a dealer
router.delete('/:id', deleteDealer)

// UPDATE a dealer
router.patch('/:id', updateDealer)


module.exports = router