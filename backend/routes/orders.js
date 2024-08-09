const express = require('express')
const {
    getOrders,
    getOrder,
    createOrder,
    deleteOrder,
    updateOrder,
    getOrdersAdmin
} = require('../controllers/orderController')
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

// require auth for all Order routes
router.use(requireAuth)

// GET all Orders
router.get('/', getOrders)

// Get all Orders for Admin
router.get('/admin', getOrdersAdmin)

//GET a single Order
router.get('/:id', getOrder)

// POST a new Order
router.post('/', createOrder)

// DELETE a Order
router.delete('/:id', deleteOrder)

// UPDATE a Order
router.patch('/:id', updateOrder)



module.exports = router