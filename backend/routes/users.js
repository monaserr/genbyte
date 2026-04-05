const router = require('express').Router()
const User = require('../models/User')
const auth = require('../middleware/auth')
const isAdmin = require('../middleware/isAdmin')

// GET all users (admin only)
router.get('/', auth, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password')
    res.json(users)
  } catch (err) {
    res.status(500).json({ msg: err.message })
  }
})

module.exports = router