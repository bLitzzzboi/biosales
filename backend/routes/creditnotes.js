const express = require('express')
const {
    getCreditNotes,
    getCreditNotesAdmin,
    getCreditNote,
    createCreditNote,
    deleteCreditNote,
    updateCreditNote
} = require('../controllers/creditnoteController')
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

// require auth for all visit routes
router.use(requireAuth)

// GET all visits
router.get('/', getCreditNotes)

// GET all visits for admin
router.get('/admin', getCreditNotesAdmin)

//GET a single visit
router.get('/:id', getCreditNote)

// POST a new visit
router.post('/', createCreditNote)

// DELETE a visit
router.delete('/:id', deleteCreditNote)

// UPDATE a visit
router.patch('/:id', updateCreditNote)


module.exports = router