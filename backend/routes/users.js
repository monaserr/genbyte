const router = require('express').Router()
const User = require('../models/User')
const auth = require('../middleware/auth')
const isAdmin = require('../middleware/isAdmin')

// GET all users (admin only)
router.get('/', auth, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password')
    console.log(`✅ Fetched ${users.length} users`)
    res.json(users)
  } catch (err) {
    console.error('❌ Fetch users error:', err.message)
    res.status(500).json({ msg: err.message })
  }
})

module.exports = router