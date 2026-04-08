module.exports = (req, res, next) => {
  if (!req.user) {
    console.log('⚠️ No user in request')
    return res.status(401).json({ msg: 'Not authenticated' })
  }
  
  if (req.user.role !== 'admin') {
    console.log(`⚠️ Non-admin user attempted admin action: ${req.user.id}`)
    return res.status(403).json({ msg: 'Admin access required' })
  }
  
  console.log(`✅ Admin verified: ${req.user.id}`)
  next()
}