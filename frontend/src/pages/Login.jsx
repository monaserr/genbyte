import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Logo from '../components/Logo'
import axios from 'axios'

export default function Login() {
  const [tab, setTab] = useState('signin')
  const [form, setForm] = useState({ name: '', email: '', password: '', year: 'Year 1' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuth()
  const nav = useNavigate()

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async () => {
    setLoading(true)
    setError('')
    try {
      const url = tab === 'signin' ? '/api/auth/login' : '/api/auth/register'
      const { data } = await axios.post(url, form)
      login(data.user, data.token)
      nav(data.user.role === 'admin' ? '/admin' : '/student')
    } catch (err) {
      setError(err.response?.data?.msg || 'Something went wrong')
    }
    setLoading(false)
  }

  const inp = { width: '100%', background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 10, padding: '.62rem .85rem', color: '#f1f5f9', fontSize: '.88rem', outline: 'none', fontFamily: 'inherit', marginBottom: '.9rem' }

  return (
      <div style={{ background: 'var(--bg)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div style={{ background: 'rgba(255,255,255,.05)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,.09)', borderRadius: 20, padding: '2rem', width: '100%', maxWidth: 380, margin: '1rem' }}>

        {/* LOGO */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '.5rem' }}><Logo /></div>
          <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#f1f5f9' }}>GenByte</div>
          <div style={{ fontSize: '.6rem', color: 'rgba(255,255,255,.35)' }}><b style={{ color: '#818cf8' }}>Naaserr</b> & <b style={{ color: '#818cf8' }}>3laaa</b></div>
        </div>

        {/* TABS */}
        <div style={{ display: 'flex', background: 'rgba(255,255,255,.05)', borderRadius: 10, padding: 3, marginBottom: '1.5rem', gap: 3 }}>
          {['signin', 'signup'].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ flex: 1, padding: '.42rem', borderRadius: 7, fontSize: '.82rem', fontWeight: 500, cursor: 'pointer', border: 'none', fontFamily: 'inherit', background: tab === t ? 'rgba(255,255,255,.08)' : 'transparent', color: tab === t ? '#f1f5f9' : 'rgba(255,255,255,.4)', transition: 'all .2s' }}>
              {t === 'signin' ? 'Sign In' : 'Sign Up'}
            </button>
          ))}
        </div>

        {/* FORM */}
        {tab === 'signup' && <input style={inp} name="name" placeholder="Full Name" value={form.name} onChange={handleChange} />}
        <input style={inp} name="email" type="email" placeholder="you@benha.edu.eg" value={form.email} onChange={handleChange} />
        {tab === 'signup' && (
          <select style={{ ...inp }} name="year" value={form.year} onChange={handleChange}>
            <option>Year 1</option><option>Year 2</option><option>Year 3</option><option>Year 4</option>
          </select>
        )}
        <input style={inp} name="password" type="password" placeholder="••••••••" value={form.password} onChange={handleChange} />

        {error && <div style={{ color: '#f87171', fontSize: '.78rem', marginBottom: '.75rem', textAlign: 'center' }}>{error}</div>}

        <button onClick={handleSubmit} disabled={loading} style={{ width: '100%', background: 'linear-gradient(135deg,#6366f1,#818cf8)', color: '#fff', border: 'none', borderRadius: 10, padding: '.72rem', fontWeight: 600, fontSize: '.9rem', cursor: 'pointer', fontFamily: 'inherit', opacity: loading ? .7 : 1 }}>
          {loading ? 'Loading...' : tab === 'signin' ? 'Sign In' : 'Create Account'}
        </button>

        <div style={{ textAlign: 'center', margin: '.85rem 0', fontSize: '.72rem', color: 'rgba(255,255,255,.3)' }}>or</div>

        <button onClick={() => nav('/student')} style={{ width: '100%', background: 'rgba(255,255,255,.05)', color: 'rgba(255,255,255,.6)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 10, padding: '.62rem', fontSize: '.85rem', cursor: 'pointer', fontFamily: 'inherit' }}>
          Continue as Guest
        </button>
      </div>
    </div>
  )
}