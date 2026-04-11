import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import api from '../api'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import { StaggerContainer, StaggerItem, PageTransition } from '../components/Motion'
import { useAuth } from '../context/AuthContext'

const grades = { 'A+':4,'A':4,'A-':3.7,'B+':3.3,'B':3,'B-':2.7,'C+':2.3,'C':2,'C-':1.7,'D':1,'F':0 }

// Helper to get theme-aware colors
const getStyles = () => {
  const isDark = document.documentElement.getAttribute('data-theme') !== 'light'
  if (isDark) {
    return {
      glass: { background: 'rgba(255,255,255,.06)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,.12)', borderRadius: 20, padding: '1.5rem' },
      glassSm: { background: 'rgba(255,255,255,.07)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 14, padding: '1.2rem' },
      textMuted: 'rgba(255,255,255,.4)',
      textBright: 'rgba(255,255,255,.7)',
      textSubtle: 'rgba(255,255,255,.25)',
      inputBg: 'rgba(255,255,255,.08)',
      inputBorder: 'rgba(255,255,255,.12)',
      inputBorderFocus: 'rgba(129,140,248,.3)',
    }
  } else {
    return {
      glass: { background: 'rgba(15,23,42,.02)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(15,23,42,.08)', borderRadius: 20, padding: '1.5rem' },
      glassSm: { background: 'rgba(15,23,42,.02)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1px solid rgba(15,23,42,.08)', borderRadius: 14, padding: '1.2rem' },
      textMuted: 'rgba(15,23,42,.6)',
      textBright: 'rgba(15,23,42,.8)',
      textSubtle: 'rgba(15,23,42,.4)',
      inputBg: 'rgba(15,23,42,.04)',
      inputBorder: 'rgba(15,23,42,.12)',
      inputBorderFocus: 'rgba(124,58,237,.3)',
    }
  }
}

export default function StudentDashboard() {
  const { user, logout } = useAuth()
  const [section, setSection] = useState('overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [subjects, setSubjects] = useState([])
  const [selectedYear, setSelectedYear] = useState(user?.year || 'Year 1')
  const [todos, setTodos] = useState([])
  const [todoInput, setTodoInput] = useState('')
  const [todoFilter, setTodoFilter] = useState('all')
  const [contentModal, setContentModal] = useState(null) // { subjectId, type, subject }
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loadingMaterials, setLoadingMaterials] = useState(false)
  const [gpaRows, setGpaRows] = useState([
    { id: 1, name: '', credits: 3, grade: 'B' },
    { id: 2, name: '', credits: 3, grade: 'A' },
  ])
  const [theme, setTheme] = useState(getStyles())

  // Update theme when it changes
  useEffect(() => {
    setTheme(getStyles())
    const observer = new MutationObserver(() => setTheme(getStyles()))
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    return () => observer.disconnect()
  }, [])

  // Fetch subjects - callable from anywhere
  const fetchSubjects = async (year = selectedYear) => {
    setLoadingMaterials(true)
    try {
      const { data } = await api.get(`/subjects?year=${year}`)
      setSubjects(data)
      setError('')
    } catch (err) { 
      console.error('Failed to load subjects:', err)
      setError('Failed to load subjects. Please refresh the page.')
    } finally {
      setLoadingMaterials(false)
    }
  }

  // Fetch on mount and when year changes
  useEffect(() => {
    fetchSubjects()
  }, [selectedYear])

  // Optional: Poll for updates every 5 seconds when contentModal is open
  useEffect(() => {
    if (!contentModal) return
    const interval = setInterval(() => {
      fetchSubjects()
    }, 5000)
    return () => clearInterval(interval)
  }, [contentModal, selectedYear])

  const handleSelect = (id) => {
    if (id === 'signout') { logout(); return }
    setSection(id)
    setSidebarOpen(false)
  }

  const addTodo = () => {
    if (!todoInput.trim()) return
    setTodos([{ id: Date.now(), text: todoInput, subject: '', done: false }, ...todos])
    setTodoInput('')
  }

  const toggleTodo = (id) => setTodos(todos.map(t => t.id === id ? { ...t, done: !t.done } : t))
  const deleteTodo = (id) => setTodos(todos.filter(t => t.id !== id))
  const filteredTodos = todoFilter === 'all' ? todos : todoFilter === 'done' ? todos.filter(t => t.done) : todos.filter(t => !t.done)

  const calcGPA = () => {
    let pts = 0, cr = 0
    gpaRows.forEach(r => { pts += r.credits * (grades[r.grade] || 0); cr += r.credits })
    return cr > 0 ? (pts / cr).toFixed(2) : '0.00'
  }

  const gpa = calcGPA()
  const gpaLetter = gpa >= 4 ? 'A+' : gpa >= 3.7 ? 'A-' : gpa >= 3.3 ? 'B+' : gpa >= 3 ? 'B' : gpa >= 2.7 ? 'B-' : gpa >= 2.3 ? 'C+' : gpa >= 2 ? 'C' : gpa >= 1 ? 'D' : 'F'
  const pendingTodos = todos.filter(t => !t.done).length

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', color: 'var(--text)', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle,#6366f1,transparent 70%)', filter: 'blur(80px)', opacity: .35, top: -100, left: -100 }} />
        <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle,#a855f7,transparent 70%)', filter: 'blur(80px)', opacity: .3, top: '40%', right: -80 }} />
        <div style={{ position: 'absolute', width: 350, height: 350, borderRadius: '50%', background: 'radial-gradient(circle,#06b6d4,transparent 70%)', filter: 'blur(80px)', opacity: .25, bottom: -60, left: '30%' }} />
      </div>

      <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <Sidebar items={[
        { type: 'section', label: 'Student' },
        { id: 'overview', icon: '🏠', label: 'Overview' },
        { id: 'subjects', icon: '📚', label: 'Subjects' },
        { id: 'todo', icon: '✅', label: 'My Tasks', badge: pendingTodos > 0 ? pendingTodos : null, badgeColor: '#f87171' },
        { id: 'assignments', icon: '📋', label: 'Assignments' },
        { id: 'gpa', icon: '🧮', label: 'GPA Calculator' },
        { id: 'links', icon: '🔗', label: 'Uni Links' },
        { type: 'spacer' },
        { id: 'signout', icon: '🚪', label: 'Sign Out' },
      ]} active={section} onSelect={handleSelect} isOpen={sidebarOpen} />

      <div className="main-content" style={{ position: 'relative', zIndex: 1 }}>

        {/* OVERVIEW */}
        {section === 'overview' && (
          <div>
            <div style={{ marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>👋 Welcome back, {user?.name || 'Student'}!</h2>
              <p style={{ fontSize: '.82rem', color: theme.textMuted, marginTop: '.25rem' }}>Computing & Bioinformatics Engineering</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(130px,1fr))', gap: '.75rem', marginBottom: '1.25rem' }}>
              {[
                { label: 'GPA', val: gpa, color: '#34d399' },
                { label: 'Tasks Done', val: `${todos.filter(t=>t.done).length}/${todos.length}`, color: '#818cf8' },
                { label: 'Subjects', val: subjects.length, color: '#60a5fa' },
                { label: 'Pending Tasks', val: pendingTodos, color: '#fbbf24' },
              ].map(s => (
                <div key={s.label} style={theme.glassSm}>
                  <div style={{ fontSize: '.68rem', color: theme.textMuted, marginBottom: '.5rem' }}>{s.label}</div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, color: s.color }}>{s.val}</div>
                </div>
              ))}
            </div>
            <div style={theme.glass}>
              <div style={{ fontWeight: 600, marginBottom: '.85rem' }}>✅ Recent Tasks</div>
              {todos.length === 0 && <div style={{ textAlign: 'center', color: theme.textSubtle, fontSize: '.82rem', padding: '1rem' }}>No tasks yet — add some!</div>}
              {todos.slice(0, 3).map(t => (
                <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: '.7rem', padding: '.65rem .9rem', background: theme.textBright === 'rgba(255,255,255,.7)' ? 'rgba(255,255,255,.04)' : 'rgba(15,23,42,.04)', borderRadius: 10, marginBottom: '.4rem', opacity: t.done ? .5 : 1 }}>
                  <div onClick={() => toggleTodo(t.id)} style={{ width: 18, height: 18, borderRadius: 5, border: t.done ? 'none' : `1.5px solid ${theme.textBright}`, background: t.done ? '#34d399' : 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.7rem', color: '#fff', flexShrink: 0 }}>
                    {t.done ? '✓' : ''}
                  </div>
                  <span style={{ fontSize: '.83rem', textDecoration: t.done ? 'line-through' : 'none' }}>{t.text}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SUBJECTS */}
        {section === 'subjects' && (
          <div>
            <div style={{ marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>📚 Subjects</h2>
              <p style={{ fontSize: '.82rem', color: 'rgba(255,255,255,.4)', marginTop: '.25rem' }}>Your course materials</p>
            </div>
            {error && <div style={{ background: 'rgba(248,113,113,.15)', border: '1px solid rgba(248,113,113,.2)', color: '#f87171', padding: '1rem', borderRadius: 12, marginBottom: '1.2rem', fontSize: '.85rem' }}>{error}</div>}
            {success && <div style={{ background: 'rgba(52,211,153,.15)', border: '1px solid rgba(52,211,153,.2)', color: '#34d399', padding: '1rem', borderRadius: 12, marginBottom: '1.2rem', fontSize: '.85rem' }}>{success}</div>}
            <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap', marginBottom: '1.2rem' }}>
              {['Year 1','Year 2','Year 3','Year 4'].map(y => (
                <button key={y} onClick={() => setSelectedYear(y)} style={{ padding: '.35rem .85rem', borderRadius: 8, fontSize: '.76rem', fontWeight: 500, cursor: 'pointer', border: '1px solid', borderColor: selectedYear === y ? 'transparent' : 'rgba(255,255,255,.08)', background: selectedYear === y ? 'linear-gradient(135deg,#6366f1,#818cf8)' : 'rgba(255,255,255,.04)', color: selectedYear === y ? '#fff' : 'rgba(255,255,255,.4)', fontFamily: 'inherit' }}>
                  {y}
                </button>
              ))}
            </div>
            {loadingMaterials && subjects.length === 0 ? (
              <div style={{ ...theme.glass, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '3rem 2rem', textAlign: 'center', gap: '.75rem' }}>
                <div style={{ fontSize: '1.5rem', animation: 'spin 1s linear infinite' }}>⏳</div>
                <div style={{ fontSize: '.95rem', fontWeight: 600, color: 'rgba(255,255,255,.4)' }}>Loading subjects...</div>
              </div>
            ) : subjects.length === 0 ? (
              <div style={{ ...theme.glass, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '3rem 2rem', textAlign: 'center', gap: '.75rem' }}>
                <div style={{ fontSize: '2.5rem', opacity: .3 }}>📭</div>
                <div style={{ fontSize: '.95rem', fontWeight: 600, color: 'rgba(255,255,255,.4)' }}>No subjects yet</div>
                <div style={{ fontSize: '.8rem', color: 'rgba(255,255,255,.25)', maxWidth: 280, lineHeight: 1.6 }}>Subjects will appear here once your admin adds them</div>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: '1rem' }}>
                {subjects.map(s => (
                  <div key={s._id} style={{ ...theme.glass, position: 'relative', overflow: 'hidden', transition: 'all .3s ease' }}
                    onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-4px)', e.currentTarget.style.boxShadow = '0 12px 32px rgba(99,102,241,.2)')}
                    onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)', e.currentTarget.style.boxShadow = 'none')}
                  >
                    {s.image && <img src={s.image} alt={s.name} style={{ width: '100%', height: 80, objectFit: 'cover', borderRadius: 12, marginBottom: '.85rem' }} />}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '.7rem', marginBottom: '.9rem' }}>
                      {!s.image && <div style={{ width: 36, height: 36, borderRadius: 10, background: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', flexShrink: 0 }}>{s.icon}</div>}
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: '.85rem', fontWeight: 700, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.name}</div>
                        <div style={{ fontSize: '.65rem', color: 'rgba(255,255,255,.45)' }}>{s.code} · {s.credits} Cr</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '.4rem' }}>
                      <button onClick={() => setContentModal({ subjectId: s._id, type: 'summary', subject: s })} style={{ padding: '.45rem .5rem', borderRadius: 8, fontSize: '.68rem', fontWeight: 600, cursor: 'pointer', border: '1px solid rgba(255,255,255,.15)', background: 'rgba(255,255,255,.08)', color: 'rgba(255,255,255,.7)', fontFamily: 'inherit', transition: 'all .2s ease', backdropFilter: 'blur(10px)', textAlign: 'left' }}
                        onMouseEnter={e => (e.target.style.background = 'rgba(255,255,255,.15)', e.target.style.borderColor = 'rgba(255,255,255,.25)')}
                        onMouseLeave={e => (e.target.style.background = 'rgba(255,255,255,.08)', e.target.style.borderColor = 'rgba(255,255,255,.15)')}
                      >📄 Summaries <span style={{ float: 'right', fontWeight: 700 }}>({s.summaries?.length || 0})</span></button>
                      <button onClick={() => setContentModal({ subjectId: s._id, type: 'exam', subject: s })} style={{ padding: '.45rem .5rem', borderRadius: 8, fontSize: '.68rem', fontWeight: 600, cursor: 'pointer', border: '1px solid rgba(255,255,255,.15)', background: 'rgba(255,255,255,.08)', color: 'rgba(255,255,255,.7)', fontFamily: 'inherit', transition: 'all .2s ease', backdropFilter: 'blur(10px)', textAlign: 'left' }}
                        onMouseEnter={e => (e.target.style.background = 'rgba(255,255,255,.15)', e.target.style.borderColor = 'rgba(255,255,255,.25)')}
                        onMouseLeave={e => (e.target.style.background = 'rgba(255,255,255,.08)', e.target.style.borderColor = 'rgba(255,255,255,.15)')}
                      >📝 Exams <span style={{ float: 'right', fontWeight: 700 }}>({s.exams?.length || 0})</span></button>
                      <button onClick={() => setContentModal({ subjectId: s._id, type: 'video', subject: s })} style={{ padding: '.45rem .5rem', borderRadius: 8, fontSize: '.68rem', fontWeight: 600, cursor: 'pointer', border: '1px solid rgba(255,255,255,.15)', background: 'rgba(255,255,255,.08)', color: 'rgba(255,255,255,.7)', fontFamily: 'inherit', transition: 'all .2s ease', backdropFilter: 'blur(10px)', textAlign: 'left' }}
                        onMouseEnter={e => (e.target.style.background = 'rgba(255,255,255,.15)', e.target.style.borderColor = 'rgba(255,255,255,.25)')}
                        onMouseLeave={e => (e.target.style.background = 'rgba(255,255,255,.08)', e.target.style.borderColor = 'rgba(255,255,255,.15)')}
                      >🎥 Videos <span style={{ float: 'right', fontWeight: 700 }}>({s.videos?.length || 0})</span></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TODO */}
        {section === 'todo' && (
          <div>
            <div style={{ marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>✅ My Tasks</h2>
              <p style={{ fontSize: '.82rem', color: 'rgba(255,255,255,.4)', marginTop: '.25rem' }}>Stay on top of your study plan</p>
            </div>
            <div style={theme.glass}>
              <div style={{ display: 'flex', gap: '.6rem', marginBottom: '1.2rem', flexWrap: 'wrap' }}>
                <input value={todoInput} onChange={e => setTodoInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && addTodo()} placeholder="Add a new task..." style={{ flex: 1, minWidth: 180, background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.12)', borderRadius: 11, padding: '.65rem .9rem', color: 'var(--text)', fontSize: '.85rem', outline: 'none', fontFamily: 'inherit', transition: 'all .2s ease', backdropFilter: 'blur(10px)' }} 
                  onFocus={e => (e.target.style.background = 'rgba(255,255,255,.12)', e.target.style.borderColor = 'rgba(129,140,248,.3)', e.target.style.boxShadow = '0 0 0 3px rgba(129,140,248,.1)')}
                  onBlur={e => (e.target.style.background = 'rgba(255,255,255,.08)', e.target.style.borderColor = 'rgba(255,255,255,.12)', e.target.style.boxShadow = 'none')}
                />
                <button onClick={addTodo} style={{ background: 'linear-gradient(135deg,#6366f1,#818cf8)', color: '#fff', border: 'none', borderRadius: 11, padding: '.65rem 1.2rem', fontSize: '.84rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'all .2s ease', boxShadow: '0 8px 24px rgba(99,102,241,.25)' }}
                  onMouseEnter={e => (e.target.style.transform = 'translateY(-2px)', e.target.style.boxShadow = '0 12px 32px rgba(99,102,241,.35)')}
                  onMouseLeave={e => (e.target.style.transform = 'translateY(0)', e.target.style.boxShadow = '0 8px 24px rgba(99,102,241,.25)')}
                >+ Add</button>
              </div>
              <div style={{ display: 'flex', gap: '.4rem', marginBottom: '.85rem', flexWrap: 'wrap' }}>
                {['all', 'pending', 'done'].map(f => (
                  <button key={f} onClick={() => setTodoFilter(f)} style={{ padding: '.3rem .8rem', borderRadius: 8, fontSize: '.74rem', fontWeight: 500, cursor: 'pointer', border: '1px solid', borderColor: todoFilter === f ? 'rgba(129,140,248,.3)' : 'rgba(255,255,255,.08)', background: todoFilter === f ? 'rgba(129,140,248,.2)' : 'rgba(255,255,255,.04)', color: todoFilter === f ? '#818cf8' : 'rgba(255,255,255,.4)', fontFamily: 'inherit' }}>
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>
              {filteredTodos.length === 0 && <div style={{ textAlign: 'center', color: 'rgba(255,255,255,.25)', fontSize: '.82rem', padding: '1.5rem' }}>No tasks here!</div>}
              {filteredTodos.map(t => (
                <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: '.7rem', padding: '.72rem .9rem', background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.07)', borderRadius: 10, marginBottom: '.45rem', opacity: t.done ? .5 : 1 }}>
                  <div onClick={() => toggleTodo(t.id)} style={{ width: 18, height: 18, borderRadius: 5, border: t.done ? 'none' : '1.5px solid rgba(255,255,255,.2)', background: t.done ? '#34d399' : 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.7rem', color: '#fff', flexShrink: 0 }}>{t.done ? '✓' : ''}</div>
                  <span style={{ flex: 1, fontSize: '.83rem', textDecoration: t.done ? 'line-through' : 'none' }}>{t.text}</span>
                  <button onClick={() => deleteTodo(t.id)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,.2)', cursor: 'pointer', fontSize: '.85rem' }}>✕</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ASSIGNMENTS */}
        {section === 'assignments' && (
          <div>
            <div style={{ marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>📋 Assignments</h2>
              <p style={{ fontSize: '.82rem', color: 'rgba(255,255,255,.4)', marginTop: '.25rem' }}>Tasks assigned by your instructors</p>
            </div>
            {subjects.length === 0 ? (
              <div style={{ ...theme.glass, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '3rem 2rem', textAlign: 'center', gap: '.75rem' }}>
                <div style={{ fontSize: '2.5rem', opacity: .3 }}>📋</div>
                <div style={{ fontSize: '.95rem', fontWeight: 600, color: 'rgba(255,255,255,.4)' }}>No assignments yet</div>
                <div style={{ fontSize: '.8rem', color: 'rgba(255,255,255,.25)', lineHeight: 1.6 }}>Your instructor will post assignments here</div>
              </div>
            ) : (
              <div>
                {subjects.filter(s => s.assignments?.length > 0).length === 0 ? (
                  <div style={{ ...theme.glass, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '3rem 2rem', textAlign: 'center', gap: '.75rem' }}>
                    <div style={{ fontSize: '2.5rem', opacity: .3 }}>📋</div>
                    <div style={{ fontSize: '.95rem', fontWeight: 600, color: 'rgba(255,255,255,.4)' }}>No assignments yet</div>
                    <div style={{ fontSize: '.8rem', color: 'rgba(255,255,255,.25)', lineHeight: 1.6 }}>Your instructor will post assignments here</div>
                  </div>
                ) : (
                  <div>
                    {subjects.map(subject => (
                      subject.assignments && subject.assignments.length > 0 && (
                        <div key={subject._id} style={{ marginBottom: '1.5rem' }}>
                          <div style={{ fontSize: '.9rem', fontWeight: 700, marginBottom: '.5rem', color: 'rgba(255,255,255,.6)' }}>{subject.name}</div>
                          <div style={theme.glass}>
                            {subject.assignments.map(a => (
                              <div key={a.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '.75rem', padding: '.8rem 1rem', background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.07)', borderRadius: 10, marginBottom: '.5rem' }}>
                                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#a855f7', flexShrink: 0, marginTop: 5 }} />
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <div style={{ fontSize: '.82rem', fontWeight: 600, marginBottom: '.18rem' }}>{a.title}</div>
                                  <div style={{ fontSize: '.71rem', color: 'rgba(255,255,255,.38)' }}>{a.description}</div>
                                  <div style={{ fontSize: '.67rem', fontWeight: 600, marginTop: '.25rem', color: '#a855f7' }}>⏰ Due: {a.dueDate}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* GPA */}
        {section === 'gpa' && (
          <div>
            <div style={{ marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>🧮 GPA Calculator</h2>
              <p style={{ fontSize: '.82rem', color: 'rgba(255,255,255,.4)', marginTop: '.25rem' }}>Calculate your semester GPA</p>
            </div>
            <div style={theme.glass}>
              <div style={{ overflowX: 'auto' }}>
                {gpaRows.map((row) => (
                  <div key={row.id} style={{ display: 'grid', gridTemplateColumns: '2fr 70px 100px 36px', gap: '.5rem', marginBottom: '.6rem', alignItems: 'end', minWidth: 320 }}>
                    <input value={row.name} onChange={e => setGpaRows(gpaRows.map(r => r.id === row.id ? { ...r, name: e.target.value } : r))} placeholder="Course name" style={{ background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.12)', borderRadius: 10, padding: '.55rem .7rem', color: 'var(--text)', fontSize: '.81rem', outline: 'none', fontFamily: 'inherit', transition: 'all .2s ease', backdropFilter: 'blur(10px)' }}
                      onFocus={e => (e.target.style.background = 'rgba(255,255,255,.12)', e.target.style.borderColor = 'rgba(129,140,248,.3)')}
                      onBlur={e => (e.target.style.background = 'rgba(255,255,255,.08)', e.target.style.borderColor = 'rgba(255,255,255,.12)')}
                    />
                    <input type="number" value={row.credits} min="1" max="6" onChange={e => setGpaRows(gpaRows.map(r => r.id === row.id ? { ...r, credits: +e.target.value } : r))} style={{ background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.12)', borderRadius: 10, padding: '.55rem .7rem', color: 'var(--text)', fontSize: '.81rem', outline: 'none', fontFamily: 'inherit', transition: 'all .2s ease', backdropFilter: 'blur(10px)' }}
                      onFocus={e => (e.target.style.background = 'rgba(255,255,255,.12)', e.target.style.borderColor = 'rgba(129,140,248,.3)')}
                      onBlur={e => (e.target.style.background = 'rgba(255,255,255,.08)', e.target.style.borderColor = 'rgba(255,255,255,.12)')}
                    />
                    <select value={row.grade} onChange={e => setGpaRows(gpaRows.map(r => r.id === row.id ? { ...r, grade: e.target.value } : r))} style={{ background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.12)', borderRadius: 10, padding: '.55rem .7rem', color: 'var(--text)', fontSize: '.81rem', outline: 'none', fontFamily: 'inherit', transition: 'all .2s ease', backdropFilter: 'blur(10px)' }}
                      onFocus={e => (e.target.style.background = 'rgba(255,255,255,.12)', e.target.style.borderColor = 'rgba(129,140,248,.3)')}
                      onBlur={e => (e.target.style.background = 'rgba(255,255,255,.08)', e.target.style.borderColor = 'rgba(255,255,255,.12)')}
                    >
                      {Object.keys(grades).map(g => <option key={g} style={{ background: '#1a1d27', color: '#f1f5f9' }}>{g}</option>)}
                    </select>
                    <button onClick={() => setGpaRows(gpaRows.filter(r => r.id !== row.id))} style={{ background: 'rgba(248,113,113,.12)', border: '1px solid rgba(248,113,113,.2)', borderRadius: 10, width: 36, height: 36, cursor: 'pointer', color: '#f87171', fontSize: '.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .2s ease' }}
                      onMouseEnter={e => (e.target.style.background = 'rgba(248,113,113,.2)', e.target.style.transform = 'scale(1.05)')}
                      onMouseLeave={e => (e.target.style.background = 'rgba(248,113,113,.12)', e.target.style.transform = 'scale(1)')}
                    >✕</button>
                  </div>
                ))}
              </div>
              <button onClick={() => setGpaRows([...gpaRows, { id: Date.now(), name: '', credits: 3, grade: 'B' }])} style={{ padding: '.4rem 1rem', borderRadius: 10, fontSize: '.78rem', fontWeight: 600, cursor: 'pointer', border: '1.5px dashed rgba(129,140,248,.25)', background: 'rgba(129,140,248,.08)', color: 'rgba(129,140,248,.8)', fontFamily: 'inherit', marginTop: '.7rem', transition: 'all .2s ease' }}
                onMouseEnter={e => (e.target.style.background = 'rgba(129,140,248,.15)', e.target.style.borderColor = 'rgba(129,140,248,.4)')}
                onMouseLeave={e => (e.target.style.background = 'rgba(129,140,248,.08)', e.target.style.borderColor = 'rgba(129,140,248,.25)')}
              >+ Add Course</button>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.3rem', padding: '1.3rem 1.5rem', background: 'rgba(99,102,241,.15)', border: '1.5px solid rgba(129,140,248,.3)', borderRadius: 13, marginTop: '1.2rem', backdropFilter: 'blur(10px)' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#818cf8', letterSpacing: '-.05em' }}>{gpa}</div>
                <div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text)' }}>{gpaLetter}</div>
                  <div style={{ fontSize: '.75rem', color: 'rgba(255,255,255,.45)' }}>Semester GPA</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* LINKS */}
        {section === 'links' && (
          <div>
            <div style={{ marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>🔗 University Links</h2>
              <p style={{ fontSize: '.82rem', color: 'rgba(255,255,255,.4)', marginTop: '.25rem' }}>Official resources</p>
            </div>
            {subjects.length === 0 ? (
              <div style={{ ...theme.glass, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '3rem 2rem', textAlign: 'center', gap: '.75rem' }}>
                <div style={{ fontSize: '2.5rem', opacity: .3 }}>🔗</div>
                <div style={{ fontSize: '.95rem', fontWeight: 600, color: 'rgba(255,255,255,.4)' }}>No links yet</div>
              </div>
            ) : (
              <div>
                {subjects.filter(s => s.links?.length > 0).length === 0 ? (
                  <div style={{ ...theme.glass, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '3rem 2rem', textAlign: 'center', gap: '.75rem' }}>
                    <div style={{ fontSize: '2.5rem', opacity: .3 }}>🔗</div>
                    <div style={{ fontSize: '.95rem', fontWeight: 600, color: 'rgba(255,255,255,.4)' }}>No links yet</div>
                    <div style={{ fontSize: '.8rem', color: 'rgba(255,255,255,.25)', lineHeight: 1.6 }}>Your instructor will add links here</div>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: '1rem' }}>
                    {subjects.map(subject => 
                      subject.links && subject.links.map(l => (
                        <a key={l.id} href={l.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', cursor: 'pointer' }}>
                          <div style={{ background: 'rgba(255,255,255,.06)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 14, padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '.5rem', transition: 'all .2s ease', hover: 'transform scale(1.02)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', width: '100%' }}>
                              <span style={{ fontSize: '1.4rem' }}>{l.icon}</span>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: '.82rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.name}</div>
                                <div style={{ fontSize: '.68rem', color: 'rgba(255,255,255,.4)' }}>{subject.name}</div>
                              </div>
                            </div>
                            <div style={{ fontSize: '.7rem', color: 'rgba(255,255,255,.3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: '100%' }}>{l.url}</div>
                          </div>
                        </a>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

      </div>

      {/* CONTENT MODAL */}
      {contentModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.75)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: 'rgba(15,17,30,.95)', backdropFilter: 'blur(20px)', border: '1.5px solid rgba(255,255,255,.15)', borderRadius: 18, padding: 'clamp(1rem, 5vw, 2rem)', width: '100%', maxWidth: 'min(600px, 90vw)', fontFamily: 'inherit', maxHeight: '85vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.2rem', gap: '.5rem' }}>
              <h3 style={{ fontSize: 'clamp(.95rem, 4vw, 1.2rem)', fontWeight: 700, color: 'var(--text)', flex: 1 }}>
                {contentModal.type === 'summary' ? '📄 Summaries' : contentModal.type === 'exam' ? '📝 Exams' : '🎥 Videos'}
              </h3>
              <button onClick={() => setContentModal(null)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,.5)', cursor: 'pointer', fontSize: '1.5rem', fontWeight: 700, flexShrink: 0, padding: 0, width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
            </div>

            <div style={{ color: 'rgba(255,255,255,.6)', fontSize: 'clamp(.8rem, 2vw, .9rem)', marginBottom: '1.2rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,.1)' }}>
              <span style={{ fontWeight: 600 }}>{contentModal.subject.name}</span> · <span>{contentModal.subject.code}</span>
            </div>

            {loadingMaterials ? (
              <div style={{ textAlign: 'center', color: 'rgba(255,255,255,.4)', padding: '2rem 1rem' }}>
                <div style={{ fontSize: '2rem', marginBottom: '1rem', animation: 'spin 1s linear infinite' }}>⏳</div>
                <div>Loading materials...</div>
              </div>
            ) : contentModal.type === 'video' ? (
              // Videos
              <>
                {contentModal.subject.videos?.length === 0 ? (
                  <div style={{ textAlign: 'center', color: 'rgba(255,255,255,.4)', padding: '2rem 1rem' }}>
                    <div style={{ fontSize: 'clamp(1.5rem, 5vw, 2rem)', marginBottom: '1rem' }}>🎥</div>
                    <div style={{ fontSize: '.9rem' }}>No video lectures uploaded yet</div>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gap: '.6rem' }}>
                    {contentModal.subject.videos.map((video, i) => (
                      <a
                        key={i}
                        href={video.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'block',
                          padding: 'clamp(.7rem, 3vw, 1rem)',
                          background: 'rgba(255,255,255,.05)',
                          border: '1px solid rgba(255,255,255,.1)',
                          borderRadius: 10,
                          color: 'var(--text)',
                          textDecoration: 'none',
                          transition: 'all .2s ease',
                          cursor: 'pointer'
                        }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,.1)', e.currentTarget.style.borderColor = 'rgba(255,255,255,.2)', e.currentTarget.style.transform = 'translateX(4px)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,.05)', e.currentTarget.style.borderColor = 'rgba(255,255,255,.1)', e.currentTarget.style.transform = 'translateX(0)')}
                      >
                        <div style={{ fontWeight: 600, marginBottom: '.3rem', fontSize: 'clamp(.8rem, 2vw, .95rem)' }}>▶️ {video.title}</div>
                        <div style={{ fontSize: 'clamp(.7rem, 1.5vw, .8rem)', color: 'rgba(255,255,255,.45)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>🔗 {video.url}</div>
                      </a>
                    ))}
                  </div>
                )}
              </>
            ) : (
              // Summaries and Exams
              <>
                {contentModal.type === 'summary' ? (
                  contentModal.subject.summaries?.length === 0 ? (
                    <div style={{ textAlign: 'center', color: 'rgba(255,255,255,.4)', padding: '2rem 1rem' }}>
                      <div style={{ fontSize: 'clamp(1.5rem, 5vw, 2rem)', marginBottom: '1rem' }}>📄</div>
                      <div style={{ fontSize: '.9rem' }}>No summaries uploaded yet</div>
                    </div>
                  ) : (
                    <div style={{ display: 'grid', gap: '.6rem' }}>
                      {contentModal.subject.summaries.map((summary, i) => (
                        <a
                          key={i}
                          href={summary.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: 'block',
                            padding: 'clamp(.7rem, 3vw, 1rem)',
                            background: 'rgba(255,255,255,.05)',
                            border: '1px solid rgba(255,255,255,.1)',
                            borderRadius: 10,
                            color: 'var(--text)',
                            textDecoration: 'none',
                            transition: 'all .2s ease',
                            cursor: 'pointer'
                          }}
                          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,.1)', e.currentTarget.style.borderColor = 'rgba(255,255,255,.2)', e.currentTarget.style.transform = 'translateX(4px)')}
                          onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,.05)', e.currentTarget.style.borderColor = 'rgba(255,255,255,.1)', e.currentTarget.style.transform = 'translateX(0)')}
                        >
                          <div style={{ fontWeight: 600, marginBottom: '.3rem', fontSize: 'clamp(.8rem, 2vw, .95rem)' }}>📖 {summary.title}</div>
                          <div style={{ fontSize: 'clamp(.7rem, 1.5vw, .8rem)', color: 'rgba(255,255,255,.45)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>📥 {summary.url}</div>
                        </a>
                      ))}
                    </div>
                  )
                ) : (
                  contentModal.subject.exams?.length === 0 ? (
                    <div style={{ textAlign: 'center', color: 'rgba(255,255,255,.4)', padding: '2rem 1rem' }}>
                      <div style={{ fontSize: 'clamp(1.5rem, 5vw, 2rem)', marginBottom: '1rem' }}>📝</div>
                      <div style={{ fontSize: '.9rem' }}>No exams uploaded yet</div>
                    </div>
                  ) : (
                    <div style={{ display: 'grid', gap: '.6rem' }}>
                      {contentModal.subject.exams.map((exam, i) => (
                        <a
                          key={i}
                          href={exam.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: 'block',
                            padding: 'clamp(.7rem, 3vw, 1rem)',
                            background: 'rgba(255,255,255,.05)',
                            border: '1px solid rgba(255,255,255,.1)',
                            borderRadius: 10,
                            color: 'var(--text)',
                            textDecoration: 'none',
                            transition: 'all .2s ease',
                            cursor: 'pointer'
                          }}
                          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,.1)', e.currentTarget.style.borderColor = 'rgba(255,255,255,.2)', e.currentTarget.style.transform = 'translateX(4px)')}
                          onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,.05)', e.currentTarget.style.borderColor = 'rgba(255,255,255,.1)', e.currentTarget.style.transform = 'translateX(0)')}
                        >
                          <div style={{ fontWeight: 600, marginBottom: '.3rem', fontSize: 'clamp(.8rem, 2vw, .95rem)' }}>📄 {exam.title}</div>
                          <div style={{ fontSize: 'clamp(.7rem, 1.5vw, .8rem)', color: 'rgba(255,255,255,.45)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>📥 {exam.url}</div>
                        </a>
                      ))}
                    </div>
                  )
                )}
              </>
            )}
          </div>
        </div>
      )}
      
      {/* CSS for animations */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}