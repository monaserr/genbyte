import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Logo from '../components/Logo'
import api from '../api'

export default function Login() {
  const [tab, setTab] = useState('signin')
  const [form, setForm] = useState({ name: '', email: '', password: '', year: 'Year 1' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuth()
  const nav = useNavigate()

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleTabChange = (newTab) => {
    setTab(newTab)
    setForm({ name: '', email: '', password: '', year: 'Year 1' })
    setError('')
  }

  const handleSubmit = async () => {
    setError('')
    if (!form.email?.trim()) { setError('Email is required'); return }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(form.email)) { setError('Please enter a valid email address'); return }
    if (!form.password?.trim()) { setError('Password is required'); return }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return }
    if (tab === 'signup') {
      if (!form.name?.trim()) { setError('Full name is required'); return }
      if (form.year === 'Year 0' || !form.year) { setError('Please select your year'); return }
    }
    setLoading(true)
    try {
      const url = tab === 'signin' ? '/auth/login' : '/auth/register'
      const submitData = tab === 'signin' ? { email: form.email, password: form.password } : form
      const { data } = await api.post(url, submitData)
      login(data.user, data.token)
      nav(data.user.role === 'admin' ? '/admin' : '/student')
    } catch (err) {
      setError(err.response?.data?.msg || err.message || 'Cannot connect to server')
    } finally {
      setLoading(false)
    }
  }

  const inp = {
    width: '100%',
    background: 'var(--bg2)',
    border: '1px solid var(--border)',
    borderRadius: 12, padding: '.7rem .9rem',
    color: 'var(--text)', fontSize: '.88rem',
    outline: 'none', fontFamily: 'inherit', marginBottom: '.9rem',
    transition: 'all .2s ease',
  }

  return (
    <div style={{
      background: 'var(--bg)', minHeight: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Inter, system-ui, sans-serif', position: 'relative', overflow: 'hidden'
    }}>
      {/* Background blobs */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <div style={{
          position: 'absolute', width: 400, height: 400, borderRadius: '50%',
          background: 'radial-gradient(circle, var(--accent), transparent 70%)',
          filter: 'blur(80px)', opacity: .15, top: -100, left: -100
        }} />
        <div style={{
          position: 'absolute', width: 300, height: 300, borderRadius: '50%',
          background: 'radial-gradient(circle, var(--muted), transparent 70%)',
          filter: 'blur(80px)', opacity: .15, bottom: -80, right: -60
        }} />
      </div>

      <div style={{
        background: 'var(--surface)',
        backdropFilter: 'blur(30px)', WebkitBackdropFilter: 'blur(30px)',
        border: '1.5px solid var(--border)', borderRadius: 24, padding: '2.5rem',
        width: '100%', maxWidth: 400, margin: '1rem', zIndex: 1,
        boxShadow: 'var(--shadow-lg)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '.75rem' }}>
            <Logo size={44} />
          </div>
          <div style={{ fontWeight: 700, fontSize: '1.25rem', color: 'var(--text)', letterSpacing: '-.02em' }}>GenByte</div>
          <div style={{ fontSize: '.7rem', color: 'var(--muted)', marginTop: '.3rem' }}>
            <b style={{ color: 'var(--accent)' }}>Nasser</b> & <b style={{ color: 'var(--accent)' }}>3laa</b>
          </div>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex', background: 'var(--bg2)', borderRadius: 12,
          padding: 4, marginBottom: '1.8rem', gap: 4,
          border: '1px solid var(--border)'
        }}>
          {['signin', 'signup'].map(t => (
            <button key={t} onClick={() => handleTabChange(t)} style={{
              flex: 1, padding: '.5rem', borderRadius: 9, fontSize: '.82rem',
              fontWeight: 500, cursor: 'pointer', border: 'none',
              fontFamily: 'inherit', transition: 'all .2s ease',
              background: tab === t ? 'var(--accent-light)' : 'transparent',
              color: tab === t ? 'var(--accent)' : 'var(--muted)',
              boxShadow: tab === t ? '0 4px 12px rgba(243,159,90,.15)' : 'none'
            }}>
              {t === 'signin' ? 'Sign In' : 'Sign Up'}
            </button>
          ))}
        </div>

        {tab === 'signup' && (
          <input style={inp} name="name" placeholder="Full Name"
            value={form.name} onChange={handleChange}
            onFocus={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.boxShadow = '0 0 0 3px rgba(243,159,90,.15)' }}
            onBlur={e => { e.target.style.borderColor = ''; e.target.style.boxShadow = '' }}
          />
        )}
        <input style={inp} name="email" type="email" placeholder="you@benha.edu.eg"
          value={form.email} onChange={handleChange}
          onFocus={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.boxShadow = '0 0 0 3px rgba(243,159,90,.15)' }}
          onBlur={e => { e.target.style.borderColor = ''; e.target.style.boxShadow = '' }}
        />
        {tab === 'signup' && (
          <select style={{ ...inp }} name="year" value={form.year} onChange={handleChange}
            onFocus={e => { e.target.style.borderColor = 'var(--accent)' }}
            onBlur={e => { e.target.style.borderColor = '' }}
          >
            <option>Year 1</option>
            <option>Year 2</option>
            <option>Year 3</option>
            <option>Year 4</option>
          </select>
        )}
        <input style={inp} name="password" type="password" placeholder="••••••••"
          value={form.password} onChange={handleChange}
          onFocus={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.boxShadow = '0 0 0 3px rgba(243,159,90,.15)' }}
          onBlur={e => { e.target.style.borderColor = ''; e.target.style.boxShadow = '' }}
        />

        {error && (
          <div style={{
            color: '#f87171', fontSize: '.8rem', marginBottom: '.9rem',
            textAlign: 'center', background: 'rgba(248,113,113,.12)',
            padding: '.6rem', borderRadius: 10, border: '1px solid rgba(248,113,113,.2)'
          }}>{error}</div>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: '100%',
            background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
            color: '#fff', border: 'none', borderRadius: 12,
            padding: '.75rem', fontWeight: 600, fontSize: '.9rem',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontFamily: 'inherit', opacity: loading ? .7 : 1,
            transition: 'all .2s ease',
            boxShadow: '0 8px 24px rgba(243,159,90,.25)'
          }}
          onMouseEnter={e => !loading && (e.target.style.transform = 'translateY(-2px)', e.target.style.boxShadow = '0 12px 32px rgba(243,159,90,.35)')}
          onMouseLeave={e => (e.target.style.transform = 'translateY(0)', e.target.style.boxShadow = '0 8px 24px rgba(243,159,90,.25)')}
        >
          {loading ? 'Loading...' : tab === 'signin' ? 'Sign In' : 'Create Account'}
        </button>
      </div>
    </div>
  )
}
