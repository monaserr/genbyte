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

  return (
    <nav style={{
      position: 'fixed', top: 0, width: '100%', zIndex: 300,
      padding: '.7rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      background: 'rgba(7,8,15,.8)', backdropFilter: 'blur(24px)',
      borderBottom: '1px solid rgba(255,255,255,.07)', fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '.65rem' }}>
        <button onClick={onMenuClick} style={{ background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 9, width: 34, height: 34, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
          {[0,1,2].map(i => <span key={i} style={{ display: 'block', width: 16, height: 2, background: '#f1f5f9', borderRadius: 2 }} />)}
        </button>
        <Logo />
        <div>
          <div style={{ fontWeight: 700, fontSize: '.95rem', color: '#f1f5f9' }}>GenByte</div>
          <div style={{ fontSize: '.58rem', color: 'rgba(255,255,255,.35)' }}>
            <b style={{ color: '#818cf8' }}>Nasser</b> & <b style={{ color: '#818cf8' }}>3laa</b>
          </div>
        </div>
        {isAdmin && (
          <span style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)', color: '#fff', fontSize: '.62rem', fontWeight: 700, padding: '.2rem .6rem', borderRadius: 99 }}>
            ADMIN
          </span>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
        {/* THEME TOGGLE */}
        <button onClick={toggleTheme} style={{ background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 9, width: 34, height: 34, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>
          {dark ? '☀️' : '🌙'}
        </button>
        <span style={{ fontSize: '.82rem', fontWeight: 500, color: 'rgba(255,255,255,.7)' }}>
          {user?.name || 'Guest'}
        </span>
        <div onClick={handleLogout} title="Sign Out" style={{
          width: 34, height: 34, borderRadius: '50%',
          background: isAdmin ? 'linear-gradient(135deg,#7c3aed,#a855f7)' : 'linear-gradient(135deg,#818cf8,#a78bfa)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '.75rem', fontWeight: 700, color: '#fff', cursor: 'pointer',
          border: '2px solid rgba(255,255,255,.15)'
        }}>
          {initials}
        </div>
      </div>
    </nav>
  )
}