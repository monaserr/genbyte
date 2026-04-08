const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '')
    if (!token) {
      console.log('⚠️ No token provided')
      return res.status(401).json({ msg: 'No token' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    console.log(`✅ Token verified for user: ${decoded.id}`)
    next()
  } catch (err) {
    console.error('❌ Token verification failed:', err.message)
    res.status(401).json({ msg: 'Invalid token' })
  }
}