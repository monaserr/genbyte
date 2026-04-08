import axios from 'axios'

/**
 * ============================================================
 * API CLIENT CONFIGURATION
 * ============================================================
 * Axios instance configured for JWT authentication and CORS
 */

// Get API base URL from environment variables
// Fallback to production URL if env var not set
const API_URL = import.meta.env.VITE_API_URL || 'https://cozy-fulfillment-production.up.railway.app'

console.log('🔌 API Base URL:', API_URL)
console.log('🌍 Frontend Origin:', window.location.origin)

/**
 * Create axios instance with base configuration
 */
const api = axios.create({
  baseURL: `${API_URL}/api`,
  
  // Headers sent with every request
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'ngrok-skip-browser-warning': 'true'  // Skip ngrok browser warning if using ngrok
  },
  
  // IMPORTANT: Allow credentials (cookies, auth headers) to be sent
  // This is REQUIRED for JWT cookies to work with CORS
  withCredentials: true,
  
  // Request/response timeouts
  timeout: 30000  // 30 seconds
})

/**
 * ============================================================
 * REQUEST INTERCEPTOR
 * ============================================================
 * Runs before each request - adds JWT token to headers
 */
api.interceptors.request.use(
  config => {
    // Get JWT token from localStorage
    const token = localStorage.getItem('token')
    
    // Add token to Authorization header if it exists
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
      console.log(`🔐 JWT Token added to request`)
    }
    
    // Log the request for debugging
    console.log(`📤 [${config.method.toUpperCase()}] ${config.url}`)
    
    return config
  },
  
  error => {
    console.error('❌ Request error:', error.message)
    return Promise.reject(error)
  }
)

/**
 * ============================================================
 * RESPONSE INTERCEPTOR
 * ============================================================
 * Runs after each response - handles errors and tokens
 */
api.interceptors.response.use(
  response => {
    // Log successful responses
    console.log(`✅ Response ${response.status}: ${response.config.url}`)
    
    // If response contains a new token, save it
    if (response.data?.token) {
      localStorage.setItem('token', response.data.token)
      console.log('🔑 New token saved to localStorage')
    }
    
    return response
  },
  
  error => {
    // Handle specific error cases
    const status = error.response?.status
    const message = error.response?.data?.msg || error.message
    const url = error.config?.url
    
    console.error(`❌ Response error [${status}]: ${url}`)
    console.error(`   Message: ${message}`)
    
    // If 401 (unauthorized), clear token and redirect to login
    if (status === 401) {
      console.warn('⚠️  Unauthorized (401) - clearing token and redirecting to login')
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      
      // Redirect to login page if not already there
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login'
      }
    }
    
    // If 403 (forbidden), user doesn't have access
    if (status === 403) {
      console.warn('⚠️  Forbidden (403) - user does not have permission')
    }
    
    // If network error, show connection issue
    if (!error.response) {
      console.error('🌐 Network error - could not reach API server')
      console.error('   Check if backend is running and accessible')
      console.error('   Check browser console for CORS errors')
    }
    
    return Promise.reject(error)
  }
)

export default api