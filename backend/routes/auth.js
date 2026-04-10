const router = require('express').Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

router.post('/register', async (req, res) => {
  try {
    console.log('📝 Register request received')
    const { name, email, password, year } = req.body
    
    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ msg: 'Name, email, and password are required' })
    }

    const exists = await User.findOne({ email })
    if (exists) return res.status(400).json({ msg: 'Email already exists' })
    
    const hashed = await bcrypt.hash(password, 10)
    const user = await User.create({ 
      name, 
      email, 
      password: hashed, 
      year: year || 'Year 1'
    })
    
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )
    
    console.log(`✅ User registered: ${user._id}`)
    res.json({ 
      token, 
      user: { 
        id: user._id, 
        name: user.name, 
        role: user.role,
        email: user.email,
        year: user.year
      } 
    })
  } catch (err) {
    console.error('❌ Register error:', err.message)
    res.status(500).json({ msg: err.message })
  }
})

router.post('/login', async (req, res) => {
  try {
    console.log('🔐 Login request received')
    const { email, password } = req.body
    
    // Validation
    if (!email || !password) {
      return res.status(400).json({ msg: 'Email and password are required' })
    }

    const user = await User.findOne({ email })
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' })
    
    const match = await bcrypt.compare(password, user.password)
    if (!match) return res.status(400).json({ msg: 'Invalid credentials' })
    
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )
    
    console.log(`✅ User logged in: ${user._id}`)
    res.json({ 
      token, 
      user: { 
        id: user._id, 
        name: user.name, 
        role: user.role,
        email: user.email,
        year: user.year
      } 
    })
  } catch (err) {
    console.error('❌ Login error:', err.message)
    res.status(500).json({ msg: err.message })
  }
})

// REGISTER ADMIN (with admin code)
router.post('/register-admin', async (req, res) => {
  try {
    console.log('👨‍💼 Admin registration request received')
    const { name, email, password, adminCode } = req.body
    
    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ msg: 'Name, email, and password are required' })
    }

    // Verify admin code
    const validAdminCode = process.env.ADMIN_CODE || 'genbyte123'
    if (adminCode !== validAdminCode) {
      console.log('⚠️ Invalid admin code attempted')
      return res.status(403).json({ msg: 'Invalid admin code' })
    }

    const exists = await User.findOne({ email })
    if (exists) return res.status(400).json({ msg: 'Email already exists' })
    
    const hashed = await bcrypt.hash(password, 10)
    const user = await User.create({ 
      name, 
      email, 
      password: hashed,
      role: 'admin',
      year: 'N/A'
    })
    
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )
    
    console.log(`✅ Admin registered: ${user._id}`)
    res.json({ 
      token, 
      user: { 
        id: user._id, 
        name: user.name, 
        role: user.role,
        email: user.email,
        year: user.year
      } 
    })
  } catch (err) {
    console.error('❌ Admin registration error:', err.message)
    res.status(500).json({ msg: err.message })
  }
})

module.exports = router