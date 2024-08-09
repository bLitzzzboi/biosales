const express = require('express')
const {
    getReceipts,
    getReceiptsAdmin,
    getReceipt,
    createReceipt,
    deleteReceipt,
    updateReceipt
} = require('../controllers/receiptController')
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

// require auth for all receipt routes
router.use(requireAuth)

// GET all receipts
router.get('/', getReceipts)

// GET all receipts for admin
router.get('/admin', getReceiptsAdmin)

//GET a single receipt
router.get('/:id', getReceipt)

// POST a new receipt
router.post('/', createReceipt)

// DELETE a receipt
router.delete('/:id', deleteReceipt)

// UPDATE a receipt
router.patch('/:id', updateReceipt)


module.exports = router