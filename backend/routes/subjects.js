const router = require('express').Router()
const Subject = require('../models/Subject')
const auth = require('../middleware/auth')
const isAdmin = require('../middleware/isAdmin')

// GET all subjects by year
router.get('/', auth, async (req, res) => {
  try {
    const { year } = req.query
    const filter = year ? { year } : {}
    const subjects = await Subject.find(filter)
    res.json(subjects)
  } catch (err) {
    res.status(500).json({ msg: err.message })
  }
})

// ADD subject (admin only)
router.post('/', auth, isAdmin, async (req, res) => {
  try {
    const subject = await Subject.create(req.body)
    res.json(subject)
  } catch (err) {
    res.status(500).json({ msg: err.message })
  }
})

// DELETE subject (admin only)
router.delete('/:id', auth, isAdmin, async (req, res) => {
  try {
    await Subject.findByIdAndDelete(req.params.id)
    res.json({ msg: 'Deleted' })
  } catch (err) {
    res.status(500).json({ msg: err.message })
  }
})

module.exports = router