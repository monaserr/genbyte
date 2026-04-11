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
      setError(err.response?.data?.msg || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const inp = { 
    width: '100%', background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.12)', 
    borderRadius: 12, padding: '.7rem .9rem', color: 'var(--text)', fontSize: '.88rem', 
    outline: 'none', fontFamily: 'inherit', marginBottom: '.9rem',
    transition: 'all .2s ease', backdropFilter: 'blur(10px)'
  }

  const inpFocus = {
    ...inp, background: 'rgba(255,255,255,.12)',
    borderColor: 'rgba(129,140,248,.3)', boxShadow: '0 0 0 3px rgba(129,140,248,.1)'
  }

  const btnSubmit = {
    width: '100%', background: 'linear-gradient(135deg,#6366f1,#818cf8)', color: '#fff', 
    border: 'none', borderRadius: 12, padding: '.75rem', fontWeight: 600, fontSize: '.9rem', 
    cursor: 'pointer', fontFamily: 'inherit', opacity: loading ? .7 : 1,
    transition: 'all .2s ease', boxShadow: '0 8px 24px rgba(99,102,241,.25)'
  }

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, system-ui, sans-serif', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle,#6366f1,transparent 70%)', filter: 'blur(80px)', opacity: .25, top: -100, left: -100 }} />
        <div style={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle,#a855f7,transparent 70%)', filter: 'blur(80px)', opacity: .2, bottom: -80, right: -60 }} />
      </div>

      <div style={{ 
        background: 'rgba(255,255,255,.05)', backdropFilter: 'blur(30px)', WebkitBackdropFilter: 'blur(30px)',
        border: '1.5px solid rgba(255,255,255,.12)', borderRadius: 24, padding: '2.5rem', 
        width: '100%', maxWidth: 400, margin: '1rem', zIndex: 1,
        boxShadow: '0 8px 32px rgba(0,0,0,.3), inset 0 1px 0 rgba(255,255,255,.2)'
      }}>

        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '.75rem', filter: 'drop-shadow(0 4px 12px rgba(99,102,241,.2))' }}><Logo size={44} /></div>
          <div style={{ fontWeight: 700, fontSize: '1.25rem', color: 'var(--text)', letterSpacing: '-.02em' }}>GenByte</div>
          <div style={{ fontSize: '.7rem', color: 'rgba(255,255,255,.35)', marginTop: '.3rem' }}>
            <b style={{ color: 'var(--accent)' }}>Nasser</b> & <b style={{ color: 'var(--accent)' }}>3laa</b>
          </div>
        </div>

        <div style={{ display: 'flex', background: 'rgba(255,255,255,.08)', borderRadius: 12, padding: 4, marginBottom: '1.8rem', gap: 4, backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,.1)' }}>
          {['signin', 'signup'].map(t => (
            <button key={t} onClick={() => handleTabChange(t)} style={{ 
              flex: 1, padding: '.5rem', borderRadius: 9, fontSize: '.82rem', fontWeight: 500, 
              cursor: 'pointer', border: 'none', fontFamily: 'inherit', transition: 'all .2s ease',
              background: tab === t ? 'rgba(99,102,241,.3)' : 'transparent', 
              color: tab === t ? 'var(--text)' : 'rgba(255,255,255,.4)',
              boxShadow: tab === t ? '0 4px 12px rgba(99,102,241,.2)' : 'none'
            }}>
              {t === 'signin' ? 'Sign In' : 'Sign Up'}
            </button>
          ))}
        </div>

        {tab === 'signup' && <input style={inp} name="name" placeholder="Full Name" value={form.name} onChange={handleChange} onFocus={e => e.target.style.cssText = Object.entries(inpFocus).map(([k,v]) => `${k}:${v}`).join(';')} onBlur={e => e.target.style.cssText = Object.entries(inp).map(([k,v]) => `${k}:${v}`).join(';')} />}
        <input style={inp} name="email" type="email" placeholder="you@benha.edu.eg" value={form.email} onChange={handleChange} onFocus={e => e.target.style.cssText = Object.entries(inpFocus).map(([k,v]) => `${k}:${v}`).join(';')} onBlur={e => e.target.style.cssText = Object.entries(inp).map(([k,v]) => `${k}:${v}`).join(';')} />
        {tab === 'signup' && (
          <select style={{ ...inp }} name="year" value={form.year} onChange={handleChange} onFocus={e => e.target.style.cssText = Object.entries(inpFocus).map(([k,v]) => `${k}:${v}`).join(';')} onBlur={e => e.target.style.cssText = Object.entries(inp).map(([k,v]) => `${k}:${v}`).join(';')}>
            <option>Year 1</option><option>Year 2</option><option>Year 3</option><option>Year 4</option>
          </select>
        )}
        <input style={inp} name="password" type="password" placeholder="••••••••" value={form.password} onChange={handleChange} onFocus={e => e.target.style.cssText = Object.entries(inpFocus).map(([k,v]) => `${k}:${v}`).join(';')} onBlur={e => e.target.style.cssText = Object.entries(inp).map(([k,v]) => `${k}:${v}`).join(';')} />

        {error && <div style={{ color: '#f87171', fontSize: '.8rem', marginBottom: '.9rem', textAlign: 'center', background: 'rgba(248,113,113,.12)', padding: '.6rem', borderRadius: 10, border: '1px solid rgba(248,113,113,.2)' }}>{error}</div>}

        <button onClick={handleSubmit} disabled={loading} style={btnSubmit}
          onMouseEnter={e => !loading && (e.target.style.transform = 'translateY(-2px)', e.target.style.boxShadow = '0 12px 32px rgba(99,102,241,.35)')}
          onMouseLeave={e => (e.target.style.transform = 'translateY(0)', e.target.style.boxShadow = '0 8px 24px rgba(99,102,241,.25)')}
        >
          {loading ? 'Loading...' : tab === 'signin' ? 'Sign In' : 'Create Account'}
        </button>

      </div>
    </div>
  )
}