const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()

const app = express()

/**
 * ============================================================
 * CORS CONFIGURATION - MUST BE FIRST!
 * ============================================================
 * This is the most important middleware. It must come BEFORE
 * any routes and BEFORE body parsing middleware for preflight
 * requests to work properly.
 */
app.use(cors({
  // List of allowed origins (frontend URLs)
  origin: [
    'https://genbyte-five.vercel.app',  // Production React frontend
    'http://localhost:5173',             // Vite dev server (standard port)
    'http://localhost:5174',             // Alternative Vite port
    'http://127.0.0.1:5173',            // Localhost alias
    'http://127.0.0.1:5174'             // Localhost alias
  ],
  
  // Allow these HTTP methods
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  
  // Allow these headers in requests
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'ngrok-skip-browser-warning'  // For ngrok testing
  ],
  
  // Expose these headers to the frontend
  exposedHeaders: [
    'Content-Length',
    'X-Total-Count'
  ],
  
  // Allow credentials (cookies, authorization headers)
  credentials: true,
  
  // How long preflight request can be cached (in seconds)
  maxAge: 86400  // 24 hours
}))

/**
 * ============================================================
 * BODY PARSING MIDDLEWARE
 * ============================================================
 * Parses incoming request bodies. Must come AFTER CORS,
 * BEFORE routes.
 */

// JSON body parser - for application/json requests
app.use(express.json({ 
  limit: '50mb',  // Maximum JSON payload size
  strict: true,
  type: 'application/json'
}))

// URL-encoded body parser - for form submissions
app.use(express.urlencoded({ 
  limit: '50mb',  // Maximum form data size
  extended: true,  // Use qs library for parsing
  parameterLimit: 50000
}))

/**
 * ============================================================
 * REQUEST LOGGING MIDDLEWARE
 * ============================================================
 * Logs all incoming requests with method, path, and body
 * (helpful for debugging)
 */
app.use((req, res, next) => {
  const timestamp = new Date().toISOString()
  const method = req.method
  const path = req.path
  const origin = req.get('origin') || 'unknown'
  
  // Log the request
  console.log(`[${timestamp}] ${method.padEnd(6)} ${path} (from: ${origin})`)
  
  // Log request body if present (excluding passwords)
  if (Object.keys(req.body).length > 0) {
    const bodyString = JSON.stringify(req.body, null, 2)
    // Hide sensitive data
    const sanitized = bodyString
      .replace(/"password":\s*"[^"]*"/g, '"password":"***"')
      .replace(/"token":\s*"[^"]*"/g, '"token":"***"')
    console.log('Request Body:', sanitized)
  }
  
  next()
})

/**
 * ============================================================
 * ROUTE HANDLERS
 * ============================================================
 * All routes are prefixed with /api/ for organization
 */
app.use('/api/auth', require('./routes/auth'))
app.use('/api/subjects', require('./routes/subjects'))
app.use('/api/users', require('./routes/users'))

/**
 * ============================================================
 * DATABASE CONNECTION
 * ============================================================
 * Connects to MongoDB Atlas with proper timeouts
 */
mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 30000,  // 30 second timeout for server selection
  socketTimeoutMS: 45000,            // 45 second timeout for socket operations
  retryWrites: true,
  w: 'majority'
})
  .then(() => {
    console.log('✅ MongoDB Connected')
    console.log(`   Database: ${process.env.MONGO_URI.split('/').pop().split('?')[0]}`)
  })
  .catch(err => {
    console.error('❌ DB Connection Error:', err.message)
    process.exit(1)  // Exit process if can't connect to DB
  })

/**
 * ============================================================
 * HEALTH CHECK ENDPOINT
 * ============================================================
 * Simple endpoint to verify backend is running
 */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'production'
  })
})

/**
 * ============================================================
 * ROOT ENDPOINT
 * ============================================================
 * Basic info when accessing root path
 */
app.get('/', (req, res) => {
  res.json({
    name: 'GenByte API',
    version: '1.0.0',
    status: 'Running',
    endpoints: {
      auth: '/api/auth',
      subjects: '/api/subjects',
      users: '/api/users',
      health: '/api/health'
    }
  })
})

/**
 * ============================================================
 * ERROR HANDLING MIDDLEWARE
 * ============================================================
 * Catches all errors and sends proper JSON responses
 */
app.use((err, req, res, next) => {
  const statusCode = err.status || err.statusCode || 500
  const message = err.message || 'Internal Server Error'
  
  console.error(`❌ [${new Date().toISOString()}] Error:`)
  console.error(`   Status: ${statusCode}`)
  console.error(`   Message: ${message}`)
  console.error(`   Path: ${req.path}`)
  
  // Send error response
  res.status(statusCode).json({
    success: false,
    msg: message,
    status: statusCode,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  })
})

/**
 * ============================================================
 * 404 HANDLER
 * ============================================================
 * Catches requests to undefined routes
 */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    msg: `Route not found: ${req.method} ${req.path}`,
    status: 404
  })
})

/**
 * ============================================================
 * SERVER STARTUP
 * ============================================================
 * Start listening on the specified port
 */
const PORT = process.env.PORT || 5000

const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`
╔════════════════════════════════════════╗
║   GenByte Backend Server Started       ║
╠════════════════════════════════════════╣
║   🚀 Server: http://localhost:${PORT}${' '.repeat(9-PORT.toString().length)}║
║   📦 Environment: Production           ║
║   🔐 CORS Enabled for:                 ║
║      • https://genbyte-five.vercel.app║
║      • http://localhost:5173           ║
║      • http://localhost:5174           ║
╚════════════════════════════════════════╝
  `)
})

/**
 * ============================================================
 * GRACEFUL SHUTDOWN
 * ============================================================
 * Handle termination signals properly
 */
process.on('SIGTERM', () => {
  console.log('⚠️  SIGTERM signal received: closing HTTP server')
  server.close(() => {
    console.log('✅ HTTP server closed')
    mongoose.connection.close(false, () => {
      console.log('✅ MongoDB connection closed')
      process.exit(0)
    })
  })
})

process.on('SIGINT', () => {
  console.log('⚠️  SIGINT signal received: closing HTTP server')
  server.close(() => {
    console.log('✅ HTTP server closed')
    mongoose.connection.close(false, () => {
      console.log('✅ MongoDB connection closed')
      process.exit(0)
    })
  })
})

module.exports = app

