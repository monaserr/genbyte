import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './theme-overrides.css'
import App from './App.jsx'

// ✅ اللون الافتراضي = light دايمًا عند الفتح
document.documentElement.setAttribute('data-theme', 'light')

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
