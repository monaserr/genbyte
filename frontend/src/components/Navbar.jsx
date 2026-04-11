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
    background: 'rgba(212,160,23,.08)',
    border: '1px solid rgba(212,160,23,.15)',
    borderRadius: 10,
    width: 36,
    height: 36,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all .2s ease',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
  }

  return (
    <nav style={{
      position: 'fixed',
      top: 12,
      left: '50%',
      transform: 'translateX(-50%)',
      width: 'calc(100% - 48px)',
      maxWidth: 1200,
      zIndex: 300,
      padding: '.7rem 1.25rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      background: dark
        ? 'rgba(8,6,0,.55)'
        : 'rgba(255,253,245,.6)',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      borderRadius: 16,
      border: dark
        ? '1px solid rgba(212,160,23,.18)'
        : '1px solid rgba(212,160,23,.3)',
      fontFamily: 'Inter, system-ui, sans-serif',
      boxShadow: dark
        ? '0 8px 32px rgba(0,0,0,.4), inset 0 1px 0 rgba(212,160,23,.08)'
        : '0 8px 32px rgba(212,160,23,.12), inset 0 1px 0 rgba(255,255,255,.8)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
        <button
          onClick={onMenuClick}
          style={{ ...btnStyle, flexDirection: 'column', gap: 4 }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(212,160,23,.16)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(212,160,23,.08)'}
        >
          {[0,1,2].map(i => <span key={i} style={{ display: 'block', width: 16, height: 2, background: 'var(--accent)', borderRadius: 1 }} />)}
        </button>
        <Logo size={32} />
        <div>
          <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text)', letterSpacing: '-.02em' }}>GenByte</div>
          <div style={{ fontSize: '.6rem', color: 'var(--muted)' }}>
            <b style={{ color: 'var(--accent)' }}>Nasser</b> & <b style={{ color: 'var(--accent)' }}>3laa</b>
          </div>
        </div>
        {isAdmin && (
          <span style={{
            background: 'linear-gradient(135deg,#a07810,#d4a017)',
            color: '#080600',
            fontSize: '.65rem',
            fontWeight: 700,
            padding: '.25rem .65rem',
            borderRadius: 99,
            boxShadow: '0 4px 12px rgba(212,160,23,.3)',
            letterSpacing: '.05em'
          }}>
            ADMIN
          </span>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '.85rem' }}>
        <button
          onClick={toggleTheme}
          style={{ ...btnStyle, fontSize: '1rem' }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(212,160,23,.16)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(212,160,23,.08)'}
        >
          {dark ? '☀️' : '🌙'}
        </button>
        <span style={{ fontSize: '.85rem', fontWeight: 500, color: 'var(--text)', opacity: 0.8, maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {user?.name || 'Guest'}
        </span>
        <div
          onClick={handleLogout}
          title="Sign Out"
          style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: 'linear-gradient(135deg,#a07810,#d4a017)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '.75rem',
            fontWeight: 700,
            color: '#080600',
            cursor: 'pointer',
            border: '2px solid rgba(212,160,23,.3)',
            transition: 'all .2s ease',
            boxShadow: '0 4px 12px rgba(212,160,23,.3)'
          }}
          onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.1)', e.currentTarget.style.borderColor = 'rgba(212,160,23,.6)')}
          onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)', e.currentTarget.style.borderColor = 'rgba(212,160,23,.3)')}
        >
          {initials}
        </div>
      </div>
    </nav>
  )
}