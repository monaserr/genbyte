import axios from 'axios'

// ✅ اختار الـ API URL الصح حسب البيئة
const API_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost'
    ? 'http://localhost:5000'
    : 'https://genbyte-production.up.railway.app')

console.log('🔌 API Base URL:', API_URL)

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  // ✅ withCredentials بس لو على نفس الـ domain أو CORS مضبوط صح
  withCredentials: true,
  timeout: 30000
})

// ✅ Request interceptor — بيضيف الـ token
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    console.log(`📤 [${config.method.toUpperCase()}] ${config.baseURL}${config.url}`)
    return config
  },
  error => Promise.reject(error)
)

// ✅ Response interceptor — بيعالج الأخطاء
api.interceptors.response.use(
  response => {
    if (response.data?.token) {
      localStorage.setItem('token', response.data.token)
    }
    return response
  },
  error => {
    const status = error.response?.status
    const message = error.response?.data?.msg || error.message

    console.error(`❌ [${status}] ${error.config?.url} — ${message}`)

    // لو 401 امسح الـ token وروح للـ login
    if (status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login'
      }
    }

    // ✅ لو network error وضّح السبب
    if (!error.response) {
      console.error('🌐 Network error — Backend مش شغال أو CORS مشكلة')
      error.message = 'Cannot connect to server. Please try again.'
    }

    return Promise.reject(error)
  }
)

export default api
