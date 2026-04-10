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

// UPDATE user role (admin only)
router.put('/:id/role', auth, isAdmin, async (req, res) => {
  try {
    const { role } = req.body
    
    // Validate role
    if (!['student', 'admin'].includes(role)) {
      return res.status(400).json({ msg: 'Invalid role. Must be "student" or "admin"' })
    }
    
    console.log(`👤 Updating user ${req.params.id} role to: ${role}`)
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password')
    
    if (!user) return res.status(404).json({ msg: 'User not found' })
    
    console.log(`✅ User role updated: ${user.name} → ${role}`)
    res.json(user)
  } catch (err) {
    console.error('❌ Update role error:', err.message)
    res.status(500).json({ msg: err.message })
  }
})

module.exports = router