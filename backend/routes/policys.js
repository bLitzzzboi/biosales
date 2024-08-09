const express = require('express')
const {
    getPolicys,
    getPolicy,
    createPolicy,
    deletePolicy,
    updatePolicy
} = require('../controllers/policyController')
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

// require auth for all Policy routes
router.use(requireAuth)

// GET all Policys
router.get('/', getPolicys)

//GET a single Policy
router.get('/:id', getPolicy)

// POST a new Policy
router.post('/', createPolicy)

// DELETE a Policy
router.delete('/:id', deletePolicy)

// UPDATE a Policy
router.patch('/:id', updatePolicy)


module.exports = router