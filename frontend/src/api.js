import axios from 'axios'

const API = import.meta.env.VITE_API_URL || 'https://cozy-fulfillment-production.up.railway.app'

console.log('🔌 API Base URL:', API)

const api = axios.create({
  baseURL: `${API}/api`,
  headers: {
    'ngrok-skip-browser-warning': 'true',
    'Content-Type': 'application/json'
  }
})

// Request interceptor
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  console.log(`[${config.method.toUpperCase()}] ${config.url}`)
  return config
}, error => {
  console.error('❌ Request error:', error.message)
  return Promise.reject(error)
})

// Response interceptor
api.interceptors.response.use(
  response => {
    console.log(`✅ Response ${response.status}: ${response.config.url}`)
    return response
  },
  error => {
    console.error('❌ Response error:', {
      status: error.response?.status,
      message: error.response?.data?.msg || error.message,
      url: error.config?.url
    })
    return Promise.reject(error)
  }
)

export default api