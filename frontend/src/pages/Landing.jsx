import { useNavigate } from 'react-router-dom'
import Logo from '../components/Logo'

export default function Landing() {
  const nav = useNavigate()
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', color: 'var(--text)', fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* NAV */}
      <nav style={{
        position: 'fixed', top: 0, width: '100%', zIndex: 300,
        padding: '.7rem 1.5rem', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
        background: 'var(--nav-bg)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--nav-border)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '.65rem' }}>
          <Logo />
          <div>
            <div style={{ fontWeight: 700, fontSize: '.95rem', color: 'var(--text)' }}>GenByte</div>
            <div style={{ fontSize: '.58rem', color: 'var(--muted)' }}>
              <b style={{ color: 'var(--accent)' }}>Naaserr</b> & <b style={{ color: 'var(--accent)' }}>3laaa</b>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '.6rem' }}>
          <button onClick={() => nav('/login')} style={{
            background: 'var(--accent-light)', color: 'var(--text)',
            border: '1px solid var(--border)', borderRadius: 10,
            padding: '.45rem 1rem', fontSize: '.82rem', cursor: 'pointer', fontFamily: 'inherit'
          }}>Sign In</button>
          <button onClick={() => nav('/login')} style={{
            background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
            color: '#fff', border: 'none', borderRadius: 10,
            padding: '.45rem 1rem', fontSize: '.82rem', cursor: 'pointer', fontFamily: 'inherit'
          }}>Sign Up</button>
        </div>
      </nav>

      {/* HERO */}
      <div style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: '6rem 1.5rem 3rem'
      }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '.5rem',
          background: 'var(--accent-light)',
          border: '1px solid var(--border)',
          borderRadius: 99, padding: '.35rem 1rem',
          fontSize: '.75rem', color: 'var(--accent)', marginBottom: '1.5rem'
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#34d399', display: 'inline-block' }}></span>
          Built for Computing & Bioinformatics Engineers
        </div>
        <h1 style={{
          fontSize: 'clamp(2.2rem,6vw,4rem)', fontWeight: 800,
          letterSpacing: '-.04em', lineHeight: 1.05, marginBottom: '1.2rem',
          color: 'var(--text)'
        }}>
          Your academic hub<br />
          for <span style={{
            background: 'linear-gradient(135deg, var(--accent), #8B8FD9)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
          }}>GenByte</span>
        </h1>
        <p style={{
          fontSize: '1rem', color: 'var(--text-50)',
          maxWidth: 460, lineHeight: 1.75, marginBottom: '2.5rem'
        }}>
          Summaries, exams, videos, GPA calculator, and university links — all in one place, built by students for students.
        </p>
        <div style={{ display: 'flex', gap: '.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button onClick={() => nav('/login')} style={{
            background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
            color: '#fff', border: 'none', borderRadius: 10,
            padding: '.72rem 1.6rem', fontSize: '.9rem', fontWeight: 600,
            cursor: 'pointer', boxShadow: '0 0 24px rgba(243,159,90,.35)', fontFamily: 'inherit'
          }}>Get Started Free</button>
          <button onClick={() => nav('/login')} style={{
            background: 'var(--accent-light)', color: 'var(--text)',
            border: '1px solid var(--border)', borderRadius: 10,
            padding: '.72rem 1.6rem', fontSize: '.9rem', cursor: 'pointer', fontFamily: 'inherit'
          }}>View Dashboard →</button>
        </div>
      </div>
    </div>
  )
}
