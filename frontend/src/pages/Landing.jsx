import { useNavigate } from 'react-router-dom'
import Logo from '../components/Logo'

export default function Landing() {
  const nav = useNavigate()
  return (
<div style={{ background: 'var(--bg)', minHeight: '100vh', color: 'var(--text)', fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* NAV */}
      <nav style={{ position: 'fixed', top: 0, width: '100%', zIndex: 300, padding: '.7rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(7,8,15,.8)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,.07)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '.65rem' }}>
          <Logo />
          <div>
            <div style={{ fontWeight: 700, fontSize: '.95rem' }}>GenByte</div>
            <div style={{ fontSize: '.58rem', color: 'rgba(255,255,255,.4)' }}><b style={{ color: '#818cf8' }}>Naaserr</b> & <b style={{ color: '#818cf8' }}>3laaa</b></div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '.6rem' }}>
          <button onClick={() => nav('/login')} style={{ background: 'rgba(255,255,255,.07)', color: '#f1f5f9', border: '1px solid rgba(255,255,255,.1)', borderRadius: 10, padding: '.45rem 1rem', fontSize: '.82rem', cursor: 'pointer', fontFamily: 'inherit' }}>Sign In</button>
          <button onClick={() => nav('/login')} style={{ background: 'linear-gradient(135deg,#6366f1,#818cf8)', color: '#fff', border: 'none', borderRadius: 10, padding: '.45rem 1rem', fontSize: '.82rem', cursor: 'pointer', fontFamily: 'inherit' }}>Sign Up</button>
        </div>
      </nav>

      {/* HERO */}
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '6rem 1.5rem 3rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '.5rem', background: 'rgba(129,140,248,.1)', border: '1px solid rgba(129,140,248,.2)', borderRadius: 99, padding: '.35rem 1rem', fontSize: '.75rem', color: '#818cf8', marginBottom: '1.5rem' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#34d399', display: 'inline-block' }}></span>
          Built for Computing & Bioinformatics Engineers
        </div>
        <h1 style={{ fontSize: 'clamp(2.2rem,6vw,4rem)', fontWeight: 800, letterSpacing: '-.04em', lineHeight: 1.05, marginBottom: '1.2rem' }}>
          Your academic hub<br />
          for <span style={{ background: 'linear-gradient(135deg,#818cf8,#c084fc,#60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>GenByte</span>
        </h1>
        <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,.5)', maxWidth: 460, lineHeight: 1.75, marginBottom: '2.5rem' }}>
          Summaries, exams, videos, GPA calculator, and university links — all in one place, built by students for students.
        </p>
        <div style={{ display: 'flex', gap: '.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button onClick={() => nav('/login')} style={{ background: 'linear-gradient(135deg,#6366f1,#818cf8)', color: '#fff', border: 'none', borderRadius: 10, padding: '.72rem 1.6rem', fontSize: '.9rem', fontWeight: 600, cursor: 'pointer', boxShadow: '0 0 24px rgba(99,102,241,.4)', fontFamily: 'inherit' }}>Get Started Free</button>
          <button onClick={() => nav('/student')} style={{ background: 'rgba(255,255,255,.05)', color: '#f1f5f9', border: '1px solid rgba(255,255,255,.1)', borderRadius: 10, padding: '.72rem 1.6rem', fontSize: '.9rem', cursor: 'pointer', fontFamily: 'inherit' }}>View Dashboard →</button>
        </div>
      </div>
    </div>
  )
}