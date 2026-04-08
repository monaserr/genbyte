import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Logo from './Logo'

export default function Navbar({ onMenuClick, isAdmin = false }) {
  const { user, logout } = useAuth()
  const nav = useNavigate()
  const [dark, setDark] = useState(true)

  const toggleTheme = () => {
    setDark(!dark)
    document.documentElement.setAttribute('data-theme', dark ? 'light' : 'dark')
  }

  const handleLogout = () => { logout(); nav('/') }

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'GB'

  const btnStyle = {
    background: 'rgba(255,255,255,.08)',
    border: '1px solid rgba(255,255,255,.12)',
    borderRadius: 10,
    width: 36,
    height: 36,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all .2s ease',
    backdropFilter: 'blur(10px)'
  }

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      width: '100%',
      zIndex: 300,
      padding: '.8rem 1.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      background: 'rgba(7,8,15,.6)',
      backdropFilter: 'blur(30px)',
      WebkitBackdropFilter: 'blur(30px)',
      borderBottom: '1px solid rgba(255,255,255,.12)',
      fontFamily: 'Inter, system-ui, sans-serif',
      boxShadow: '0 8px 24px rgba(0,0,0,.15)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
        <button 
          onClick={onMenuClick}
          style={{...btnStyle, flexDirection: 'column', gap: 4, opacity: 0.7 }}
          onMouseEnter={e => (e.target.style.background = 'rgba(255,255,255,.12)', e.target.style.opacity = '1')}
          onMouseLeave={e => (e.target.style.background = 'rgba(255,255,255,.08)', e.target.style.opacity = '0.7')}
        >
          {[0,1,2].map(i => <span key={i} style={{ display: 'block', width: 16, height: 2, background: 'var(--text)', borderRadius: 1 }} />)}
        </button>
        <Logo size={32} />
        <div>
          <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text)', letterSpacing: '-.02em' }}>GenByte</div>
          <div style={{ fontSize: '.6rem', color: 'rgba(255,255,255,.4)' }}>
            <b style={{ color: 'var(--accent)' }}>Nasser</b> & <b style={{ color: 'var(--accent)' }}>3laa</b>
          </div>
        </div>
        {isAdmin && (
          <span style={{ 
            background: 'linear-gradient(135deg,#7c3aed,#a855f7)', 
            color: '#fff', 
            fontSize: '.65rem', 
            fontWeight: 700, 
            padding: '.25rem .65rem', 
            borderRadius: 99,
            boxShadow: '0 4px 12px rgba(124,58,237,.3)'
          }}>
            ADMIN
          </span>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '.85rem' }}>
        {/* THEME TOGGLE */}
        <button 
          onClick={toggleTheme} 
          style={{...btnStyle, fontSize: '1rem', opacity: 0.7}}
          onMouseEnter={e => (e.target.style.background = 'rgba(255,255,255,.12)', e.target.style.opacity = '1')}
          onMouseLeave={e => (e.target.style.background = 'rgba(255,255,255,.08)', e.target.style.opacity = '0.7')}
        >
          {dark ? '☀️' : '🌙'}
        </button>
        <span style={{ fontSize: '.85rem', fontWeight: 500, color: 'var(--text)', opacity: 0.8, maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {user?.name || 'Guest'}
        </span>
        <div 
          onClick={handleLogout} 
          title="Sign Out" 
          style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: isAdmin ? 'linear-gradient(135deg,#7c3aed,#a855f7)' : 'linear-gradient(135deg,#818cf8,#a78bfa)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '.75rem',
            fontWeight: 700,
            color: '#fff',
            cursor: 'pointer',
            border: '2px solid rgba(255,255,255,.2)',
            transition: 'all .2s ease',
            boxShadow: isAdmin ? '0 4px 12px rgba(124,58,237,.3)' : '0 4px 12px rgba(129,140,248,.3)'
          }}
          onMouseEnter={e => (e.target.style.transform = 'scale(1.1)', e.target.style.borderColor = 'rgba(255,255,255,.4)')}
          onMouseLeave={e => (e.target.style.transform = 'scale(1)', e.target.style.borderColor = 'rgba(255,255,255,.2)')}
        >
          {initials}
        </div>
      </div>
    </nav>
  )
}