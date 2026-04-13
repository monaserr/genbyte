const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()

const app = express()

// ✅ CORS — يقبل أي Vercel URL + localhost
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
]

app.use(cors({
  origin: (origin, callback) => {
    // اقبل لو مفيش origin (Postman/curl) أو localhost أو أي Vercel URL
    if (
      !origin ||
      allowedOrigins.includes(origin) ||
      /^https:\/\/.*\.vercel\.app$/.test(origin)
    ) {
      callback(null, true)
    } else {
      console.warn('⛔ CORS blocked origin:', origin)
      callback(new Error('Not allowed by CORS'))
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'ngrok-skip-browser-warning'],
  exposedHeaders: ['Content-Length', 'X-Total-Count'],
  credentials: true,
  maxAge: 86400
}))

// Body parsing
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))

// Request logging
app.use((req, res, next) => {
  const method = req.method
  const path = req.path
  const origin = req.get('origin') || 'unknown'
  console.log(`[${new Date().toISOString()}] ${method.padEnd(6)} ${path} (from: ${origin})`)
  next()
})

// ✅ Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'production'
  })
})

// Root
app.get('/', (req, res) => {
  res.json({
    name: 'GenByte API',
    version: '1.0.0',
    status: 'Running',
    endpoints: { auth: '/api/auth', subjects: '/api/subjects', users: '/api/users', health: '/api/health' }
  })
})

// Routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/subjects', require('./routes/subjects'))
app.use('/api/users', require('./routes/users'))

// ✅ Error handler — لازم يجي قبل الـ 404
app.use((err, req, res, next) => {
  // Multer errors
  if (err.name === 'MulterError') {
    if (err.code === 'FILE_TOO_LARGE') return res.status(413).json({ msg: 'File too large (max 100MB)' })
    if (err.code === 'LIMIT_FILE_COUNT') return res.status(400).json({ msg: 'Too many files' })
    return res.status(400).json({ msg: 'File upload error: ' + err.message })
  }
  if (err.message?.includes('not allowed')) return res.status(400).json({ msg: err.message })
  if (err.message?.includes('Cloudinary')) return res.status(500).json({ msg: 'Cloud storage error: ' + err.message })

  const statusCode = err.status || err.statusCode || 500
  console.error(`❌ Error [${statusCode}]: ${err.message}`)
  res.status(statusCode).json({
    success: false,
    msg: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  })
})

// ✅ 404 — لازم يجي آخر حاجة
app.use((req, res) => {
  res.status(404).json({ success: false, msg: `Route not found: ${req.method} ${req.path}` })
})

// Database
mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000,
  retryWrites: true,
  w: 'majority'
})
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => { console.error('❌ DB Error:', err.message); process.exit(1) })

// Start server
const PORT = process.env.PORT || 5000
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 GenByte backend running on port ${PORT}`)
})

// Graceful shutdown
const shutdown = (signal) => {
  console.log(`⚠️ ${signal} received`)
  server.close(() => {
    mongoose.connection.close(false, () => process.exit(0))
  })
}
process.on('SIGTERM', () => shutdown('SIGTERM'))
process.on('SIGINT', () => shutdown('SIGINT'))

module.exports = app
