import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import api from '../api'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import AnalyticsDashboard from '../components/AnalyticsDashboard'
import { StaggerContainer, StaggerItem, PageTransition } from '../components/Motion'
import { useAuth } from '../context/AuthContext'

const icons = ['🗂️','📐','🧬','📊','💡','🧪','🖥️','🔬']
const colors = ['rgba(129,140,248,.12)','rgba(96,165,250,.12)','rgba(52,211,153,.12)','rgba(251,191,36,.12)','rgba(244,114,182,.12)','rgba(45,212,191,.12)','rgba(168,85,247,.12)','rgba(251,146,60,.12)']
const avatarColors = ['linear-gradient(135deg,#6366f1,#818cf8)','linear-gradient(135deg,#0891b2,#06b6d4)','linear-gradient(135deg,#be185d,#f472b6)','linear-gradient(135deg,#059669,#34d399)','linear-gradient(135deg,#d97706,#fbbf24)','linear-gradient(135deg,#7c3aed,#a855f7)']

// Helper to get theme-aware styles
const getStyles = () => {
  try {
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light'

  if (isDark) {
    return {
      glass: { background: 'rgba(255,255,255,.06)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,.12)', borderRadius: 20, padding: '1.5rem' },
      glassSm: { background: 'rgba(255,255,255,.07)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 14, padding: '1.2rem' },
      inp: { width: '100%', background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.12)', borderRadius: 11, padding: '.7rem .9rem', color: 'var(--text)', fontSize: '.85rem', outline: 'none', fontFamily: 'inherit', marginBottom: '.85rem', transition: 'all .2s ease', backdropFilter: 'blur(10px)' },
      btnPrimary: { background: 'linear-gradient(135deg,#6366f1,#818cf8)', color: '#fff', border: 'none', borderRadius: 11, padding: '.7rem 1.3rem', fontSize: '.84rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'all .2s ease', boxShadow: '0 8px 24px rgba(99,102,241,.25)' },
      btnDanger: { background: 'rgba(248,113,113,.15)', color: '#f87171', border: '1px solid rgba(248,113,113,.2)', borderRadius: 9, padding: '.35rem .75rem', fontSize: '.73rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'all .2s ease', backdropFilter: 'blur(10px)' },
      btnSm: { background: 'rgba(168,85,247,.15)', color: '#a855f7', border: '1px solid rgba(168,85,247,.2)', borderRadius: 9, padding: '.35rem .75rem', fontSize: '.73rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'all .2s ease', backdropFilter: 'blur(10px)' },
      textMuted: 'rgba(255,255,255,.4)',
      textSubtle: 'rgba(255,255,255,.25)',
    }
  } else {
    return {
      glass: { background: 'rgba(15,23,42,.02)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(15,23,42,.08)', borderRadius: 20, padding: '1.5rem' },
      glassSm: { background: 'rgba(15,23,42,.02)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1px solid rgba(15,23,42,.08)', borderRadius: 14, padding: '1.2rem' },
      inp: { width: '100%', background: '#ffffff', border: '1px solid rgba(15,23,42,.12)', borderRadius: 11, padding: '.7rem .9rem', color: 'var(--text)', fontSize: '.85rem', outline: 'none', fontFamily: 'inherit', marginBottom: '.85rem', transition: 'all .2s ease', backdropFilter: 'blur(10px)' },
      btnPrimary: { background: 'linear-gradient(135deg,#7c3aed,#6d28d9)', color: '#fff', border: 'none', borderRadius: 11, padding: '.7rem 1.3rem', fontSize: '.84rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'all .2s ease', boxShadow: '0 8px 24px rgba(124,58,237,.25)' },
      btnDanger: { background: 'rgba(248,113,113,.15)', color: '#dc2626', border: '1px solid rgba(248,113,113,.2)', borderRadius: 9, padding: '.35rem .75rem', fontSize: '.73rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'all .2s ease', backdropFilter: 'blur(10px)' },
      btnSm: { background: 'rgba(124,58,237,.12)', color: '#7c3aed', border: '1px solid rgba(124,58,237,.2)', borderRadius: 9, padding: '.35rem .75rem', fontSize: '.73rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'all .2s ease', backdropFilter: 'blur(10px)' },
      textMuted: 'rgba(15,23,42,.6)',
      textSubtle: 'rgba(15,23,42,.4)',
    }
  }
  } catch (e) {
    console.error('getStyles error:', e)
    return {}
  }
}

export default function AdminDashboard() {
  const { user, logout } = useAuth()
  const [section, setSection] = useState('overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [users, setUsers] = useState([])
  const [subjects, setSubjects] = useState([])
  const [assignments, setAssignments] = useState([])
  const [links, setLinks] = useState([])
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState({})
  const [uploadModal, setUploadModal] = useState(null)
  const [uploadSubject, setUploadSubject] = useState(null)
  const [uploadFile, setUploadFile] = useState(null)
  const [uploadTitle, setUploadTitle] = useState('')
  const [uploadUrl, setUploadUrl] = useState('')
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [styles, setStyles] = useState(getStyles())
  const { glass, glassSm, inp, btnPrimary, btnDanger, btnSm } = styles

  // Update theme when it changes
  useEffect(() => {
    setStyles(getStyles())
    const observer = new MutationObserver(() => setStyles(getStyles()))
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    return () => observer.disconnect()
  }, [])

  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  useEffect(() => { fetchUsers(); fetchSubjects() }, [])

  const fetchUsers = async () => {
    try { 
      console.log('👥 Fetching users...')
      const { data } = await api.get('/users')
      console.log(`✅ Loaded ${data.length} users:`, data)
      setUsers(data)
      setError('')
    }
    catch (err) { 
      console.error('❌ Failed to load users:', err.response?.data || err.message)
      setError('Failed to load users: ' + (err.response?.data?.msg || err.message))
    }
  }

  const fetchSubjects = async () => {
    try { 
      console.log('📚 Fetching subjects...')
      const { data } = await api.get('/subjects')
      console.log(`✅ Loaded ${data.length} subjects:`, data)
      setSubjects(data)
      setError('')
    }
    catch (err) { 
      console.error('❌ Failed to load subjects:', err.response?.data || err.message)
      setError('Failed to load subjects: ' + (err.response?.data?.msg || err.message))
    }
  }

  const handleSelect = (id) => {
    if (id === 'signout') { logout(); return }
    setSection(id); setSidebarOpen(false)
  }

  const openModal = (type) => { setModal(type); setForm({}) }
  const closeModal = () => setModal(null)
  const handleForm = e => setForm({ ...form, [e.target.name]: e.target.value })

  const addSubject = async () => {
    if (!form.name) return
    const i = subjects.length % 8
    try {
      const { data } = await api.post('/subjects', {
        name: form.name, code: form.code || '—', credits: form.credits || '3',
        year: form.year || 'Year 1', icon: icons[i], color: colors[i]
      })
      setSubjects([...subjects, data])
      setSuccess('Subject created successfully!')
      setError('')
      closeModal()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) { 
      console.error(err)
      setError(err.response?.data?.msg || 'Failed to create subject')
      setSuccess('')
    }
  }

  const deleteSubject = async (id) => {
    try { await api.delete(`/subjects/${id}`); setSubjects(subjects.filter(s => s._id !== id)) }
    catch (err) { console.log(err) }
  }

  const addAssignment = () => {
    if (!form.title) return
    setAssignments([...assignments, { id: Date.now(), title: `${form.subject ? form.subject + ' — ' : ''}${form.title}`, desc: form.desc || '', due: form.due || 'TBA', color: '#a855f7' }])
    closeModal()
  }

  const addLink = () => {
    if (!form.name) return
    setLinks([...links, { id: Date.now(), icon: form.icon || '🔗', name: form.name, url: form.url || '' }])
    closeModal()
  }

  const openUploadModal = (subject, type) => {
    setUploadSubject(subject); setUploadModal(type)
    setUploadFile(null); setUploadTitle(''); setUploadUrl('')
  }

  const closeUploadModal = () => { setUploadModal(null); setUploadSubject(null) }

  const handleUpload = async () => {
    if (!uploadSubject) return
    setUploading(true)
    try {
      if (uploadModal === 'video') {
        if (!uploadTitle || !uploadUrl) {
          setError('Please fill in all fields')
          setUploading(false)
          return
        }
        console.log('📹 Uploading video:', { title: uploadTitle, url: uploadUrl })
        await api.post(`/subjects/${uploadSubject._id}/video`, { title: uploadTitle, url: uploadUrl })
      } else if (uploadModal === 'image') {
        if (!uploadFile) {
          setError('Please select an image')
          setUploading(false)
          return
        }
        console.log('🖼️ Uploading image:', uploadFile.name)
        const fd = new FormData()
        fd.append('image', uploadFile)
        await api.post(`/subjects/${uploadSubject._id}/image`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      } else {
        if (!uploadFile || !uploadTitle) {
          setError('Please fill in all fields and select a file')
          setUploading(false)
          return
        }
        console.log('📄 Uploading file:', { title: uploadTitle, type: uploadModal, file: uploadFile.name })
        const fd = new FormData()
        fd.append('file', uploadFile)
        fd.append('title', uploadTitle)
        fd.append('type', uploadModal)
        console.log('📋 FormData contents:', { title: uploadTitle, type: uploadModal })
        await api.post(`/subjects/${uploadSubject._id}/upload`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      }
      await fetchSubjects()
      setSuccess(`${uploadModal === 'video' ? 'Video' : uploadModal === 'image' ? 'Image' : 'File'} uploaded successfully!`)
      setError('')
      closeUploadModal()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) { 
      console.error('❌ Upload failed:', err.response?.data || err.message)
      setError(err.response?.data?.msg || 'Upload failed')
      setSuccess('')
    }
    setUploading(false)
  }

  const getInitials = (name) => name ? name.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase() : '??'

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', color: 'var(--text)', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle,#7c3aed,transparent 70%)', filter: 'blur(80px)', opacity: .35, top: -120, right: -80 }} />
        <div style={{ position: 'absolute', width: 380, height: 380, borderRadius: '50%', background: 'radial-gradient(circle,#0891b2,transparent 70%)', filter: 'blur(80px)', opacity: .3, bottom: 0, left: -60 }} />
        <div style={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle,#be185d,transparent 70%)', filter: 'blur(80px)', opacity: .25, top: '40%', left: '40%' }} />
      </div>

      <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} isAdmin />
      <Sidebar items={[
        { type: 'section', label: 'Overview' },
        { id: 'overview', icon: '📊', label: 'Dashboard' },
        { id: 'users', icon: '👥', label: 'Users', badge: users.length > 0 ? users.length : null, badgeColor: '#f87171' },
        { id: 'analytics', icon: '📈', label: 'Analytics' },
        { type: 'section', label: 'Content' },
        { id: 'subjects', icon: '📚', label: 'Subjects' },
        { id: 'assignments', icon: '📋', label: 'Assignments' },
        { id: 'links', icon: '🔗', label: 'Uni Links' },
        { type: 'spacer' },
        { id: 'signout', icon: '🚪', label: 'Sign Out' },
      ]} active={section} onSelect={handleSelect} isOpen={sidebarOpen} isAdmin />

      <div className="main-content" style={{ position: 'relative', zIndex: 1 }}>
        {error && <div style={{ background: 'rgba(248,113,113,.15)', border: '1px solid rgba(248,113,113,.2)', color: '#f87171', padding: '1rem', borderRadius: 12, marginBottom: '1.2rem', fontSize: '.85rem' }}>{error}</div>}
        {success && <div style={{ background: 'rgba(52,211,153,.15)', border: '1px solid rgba(52,211,153,.2)', color: '#34d399', padding: '1rem', borderRadius: 12, marginBottom: '1.2rem', fontSize: '.85rem' }}>{success}</div>}

        {/* OVERVIEW */}
        {section === 'overview' && (
          <div>
            <div style={{ marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>📊 Dashboard</h2>
              <p style={{ fontSize: '.82rem', color: 'rgba(255,255,255,.4)', marginTop: '.25rem' }}>Welcome back, {user?.name || 'Admin'}</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(130px,1fr))', gap: '.75rem', marginBottom: '1.25rem' }}>
              {[
                { label: 'Total Users', val: users.length, color: '#60a5fa' },
                { label: 'Subjects', val: subjects.length, color: '#a855f7' },
                { label: 'Assignments', val: assignments.length, color: '#fbbf24' },
                { label: 'Links', val: links.length, color: '#34d399' },
              ].map(s => (
                <div key={s.label} style={glassSm}>
                  <div style={{ fontSize: '.68rem', color: 'rgba(255,255,255,.38)', marginBottom: '.5rem' }}>{s.label}</div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, color: s.color }}>{s.val}</div>
                </div>
              ))}
            </div>
            <div style={glass}>
              <div style={{ fontWeight: 600, marginBottom: '1rem' }}>👥 Registered Users</div>
              {users.length === 0 && <div style={{ textAlign: 'center', color: 'rgba(255,255,255,.25)', fontSize: '.82rem', padding: '1rem' }}>No users yet</div>}
              {users.slice(0, 5).map((u, i) => (
                <div key={u._id} style={{ display: 'flex', alignItems: 'center', gap: '.85rem', padding: '.65rem .9rem', background: 'rgba(255,255,255,.03)', borderRadius: 10, marginBottom: '.4rem' }}>
                  <div style={{ width: 30, height: 30, borderRadius: '50%', background: avatarColors[i % avatarColors.length], display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.65rem', fontWeight: 700, flexShrink: 0 }}>{getInitials(u.name)}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '.82rem', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.name}</div>
                    <div style={{ fontSize: '.7rem', color: 'rgba(255,255,255,.35)' }}>{u.year} · {u.role}</div>
                  </div>
                  <span style={{ fontSize: '.68rem', background: u.role === 'admin' ? 'rgba(168,85,247,.15)' : 'rgba(52,211,153,.12)', color: u.role === 'admin' ? '#a855f7' : '#34d399', borderRadius: 99, padding: '.15rem .5rem', fontWeight: 600, flexShrink: 0 }}>{u.role}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* USERS */}
        {section === 'users' && (
          <div>
            <div style={{ marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>👥 Users</h2>
              <p style={{ fontSize: '.82rem', color: 'rgba(255,255,255,.4)', marginTop: '.25rem' }}>All registered students — {users.length} total</p>
            </div>
            <div style={{ ...glass, padding: 0, overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 480 }}>
                  <thead>
                    <tr style={{ background: 'rgba(255,255,255,.04)' }}>
                      {['Student','Email','Year','Role','Joined'].map(h => (
                        <th key={h} style={{ fontSize: '.68rem', fontWeight: 600, color: 'rgba(255,255,255,.35)', textTransform: 'uppercase', letterSpacing: '.08em', padding: '.75rem 1rem', textAlign: 'left', whiteSpace: 'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {users.length === 0 && <tr><td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: 'rgba(255,255,255,.25)', fontSize: '.82rem' }}>No users yet</td></tr>}
                    {users.map((u, i) => (
                      <tr key={u._id} style={{ borderTop: '1px solid rgba(255,255,255,.05)' }}>
                        <td style={{ padding: '.65rem 1rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '.6rem' }}>
                            <div style={{ width: 28, height: 28, borderRadius: '50%', background: avatarColors[i % avatarColors.length], display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.62rem', fontWeight: 700, flexShrink: 0 }}>{getInitials(u.name)}</div>
                            <span style={{ fontSize: '.82rem', whiteSpace: 'nowrap' }}>{u.name}</span>
                          </div>
                        </td>
                        <td style={{ padding: '.65rem 1rem', fontSize: '.78rem', color: 'rgba(255,255,255,.4)', whiteSpace: 'nowrap' }}>{u.email}</td>
                        <td style={{ padding: '.65rem 1rem', fontSize: '.82rem', whiteSpace: 'nowrap' }}>{u.year}</td>
                        <td style={{ padding: '.65rem 1rem' }}>
                          <span style={{ background: u.role === 'admin' ? 'rgba(168,85,247,.15)' : 'rgba(96,165,250,.12)', color: u.role === 'admin' ? '#a855f7' : '#60a5fa', borderRadius: 99, fontSize: '.65rem', fontWeight: 600, padding: '.2rem .6rem', whiteSpace: 'nowrap' }}>{u.role}</span>
                        </td>
                        <td style={{ padding: '.65rem 1rem', fontSize: '.75rem', color: 'rgba(255,255,255,.35)', whiteSpace: 'nowrap' }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ANALYTICS */}
        {section === 'analytics' && (
          <AnalyticsDashboard users={users} subjects={subjects} theme="dark" />
        )}

        {/* SUBJECTS */}
        {section === 'subjects' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '.75rem' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>📚 Subjects</h2>
                <p style={{ fontSize: '.82rem', color: 'rgba(255,255,255,.4)', marginTop: '.25rem' }}>Manage course materials</p>
              </div>
              <button style={btnPrimary} onClick={() => openModal('subject')}>+ Add Subject</button>
            </div>
            {subjects.length === 0 ? (
              <div style={{ ...glass, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '3rem 2rem', textAlign: 'center', gap: '.75rem', cursor: 'pointer', borderStyle: 'dashed', borderColor: 'rgba(255,255,255,.1)' }} onClick={() => openModal('subject')}>
                <div style={{ fontSize: '2.5rem', opacity: .3 }}>📭</div>
                <div style={{ fontSize: '.95rem', fontWeight: 600, color: 'rgba(255,255,255,.4)' }}>No subjects yet</div>
                <div style={{ fontSize: '.8rem', color: 'rgba(255,255,255,.25)', lineHeight: 1.6 }}>Click "+ Add Subject" to get started</div>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: '1rem' }}>
                {subjects.map(s => (
                  <div key={s._id} style={{ ...glass, position: 'relative', overflow: 'hidden' }}>
                    {s.image && <img src={s.image} alt={s.name} style={{ width: '100%', height: 100, objectFit: 'cover', borderRadius: 12, marginBottom: '.85rem' }} />}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '.7rem', marginBottom: '.85rem' }}>
                      {!s.image && <div style={{ width: 38, height: 38, borderRadius: 10, background: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.05rem', flexShrink: 0 }}>{s.icon}</div>}
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: '.88rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.name}</div>
                        <div style={{ fontSize: '.7rem', color: 'rgba(255,255,255,.38)' }}>{s.code} · {s.credits} Credits · {s.year}</div>
                        <div style={{ fontSize: '.68rem', color: 'rgba(255,255,255,.3)', marginTop: '.2rem' }}>
                          📄 {s.summaries?.length || 0} · 📝 {s.exams?.length || 0} · 🎥 {s.videos?.length || 0}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '.4rem', flexWrap: 'wrap' }}>
                      <button style={btnSm} onClick={() => openUploadModal(s, 'summary')}>📄 Summary</button>
                      <button style={btnSm} onClick={() => openUploadModal(s, 'exam')}>📝 Exam</button>
                      <button style={btnSm} onClick={() => openUploadModal(s, 'video')}>🎥 Video</button>
                      <button style={btnSm} onClick={() => openUploadModal(s, 'image')}>🖼️ Image</button>
                      <button style={btnDanger} onClick={() => deleteSubject(s._id)}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ASSIGNMENTS */}
        {section === 'assignments' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '.75rem' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>📋 Assignments</h2>
                <p style={{ fontSize: '.82rem', color: 'rgba(255,255,255,.4)', marginTop: '.25rem' }}>Post assignments for students</p>
              </div>
              <button style={btnPrimary} onClick={() => openModal('assignment')}>+ Add Assignment</button>
            </div>
            {assignments.length === 0 ? (
              <div style={{ ...glass, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '3rem 2rem', textAlign: 'center', gap: '.75rem' }}>
                <div style={{ fontSize: '2.5rem', opacity: .3 }}>📋</div>
                <div style={{ fontSize: '.95rem', fontWeight: 600, color: 'rgba(255,255,255,.4)' }}>No assignments yet</div>
              </div>
            ) : (
              <div style={glass}>
                {assignments.map(a => (
                  <div key={a.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '.75rem', padding: '.8rem 1rem', background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.07)', borderRadius: 10, marginBottom: '.5rem' }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: a.color, flexShrink: 0, marginTop: 5 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '.82rem', fontWeight: 600, marginBottom: '.18rem' }}>{a.title}</div>
                      <div style={{ fontSize: '.71rem', color: 'rgba(255,255,255,.38)' }}>{a.desc}</div>
                      <div style={{ fontSize: '.67rem', fontWeight: 600, marginTop: '.25rem', color: a.color }}>⏰ Due: {a.due}</div>
                    </div>
                    <button style={btnDanger} onClick={() => setAssignments(assignments.filter(x => x.id !== a.id))}>Delete</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* LINKS */}
        {section === 'links' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '.75rem' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>🔗 University Links</h2>
                <p style={{ fontSize: '.82rem', color: 'rgba(255,255,255,.4)', marginTop: '.25rem' }}>Manage links visible to students</p>
              </div>
              <button style={btnPrimary} onClick={() => openModal('link')}>+ Add Link</button>
            </div>
            {links.length === 0 ? (
              <div style={{ ...glass, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '3rem 2rem', textAlign: 'center', gap: '.75rem' }}>
                <div style={{ fontSize: '2.5rem', opacity: .3 }}>🔗</div>
                <div style={{ fontSize: '.95rem', fontWeight: 600, color: 'rgba(255,255,255,.4)' }}>No links yet</div>
              </div>
            ) : (
              <div style={glass}>
                {links.map(l => (
                  <div key={l.id} style={{ display: 'flex', alignItems: 'center', gap: '.75rem', padding: '.75rem 1rem', background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.07)', borderRadius: 10, marginBottom: '.5rem' }}>
                    <span style={{ fontSize: '1.2rem', flexShrink: 0 }}>{l.icon}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '.83rem', fontWeight: 500 }}>{l.name}</div>
                      <div style={{ fontSize: '.7rem', color: 'rgba(255,255,255,.3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.url}</div>
                    </div>
                    <button style={btnDanger} onClick={() => setLinks(links.filter(x => x.id !== l.id))}>Delete</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

      {/* ADD MODALS */}
      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.75)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', animation: 'fadeIn .2s ease' }}>
          <div style={{ background: 'rgba(15,17,30,.95)', backdropFilter: 'blur(20px)', border: '1.5px solid rgba(255,255,255,.15)', borderRadius: 22, padding: '2rem', width: '100%', maxWidth: 480, fontFamily: 'inherit', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,.3)', animation: 'slideUp .3s ease' }}>

            {modal === 'subject' && <>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.3rem', color: 'var(--text)' }}>📚 Add New Subject</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.85rem', marginBottom: '.85rem' }}>
                <div><div style={{ fontSize: '.68rem', color: 'rgba(255,255,255,.4)', marginBottom: '.35rem', fontWeight: 600 }}>Subject Name</div><input style={inp} name="name" placeholder="e.g. Data Structures" onChange={handleForm} /></div>
                <div><div style={{ fontSize: '.68rem', color: 'rgba(255,255,255,.4)', marginBottom: '.35rem', fontWeight: 600 }}>Code</div><input style={inp} name="code" placeholder="e.g. CS201" onChange={handleForm} /></div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.85rem', marginBottom: '1rem' }}>
                <div><div style={{ fontSize: '.68rem', color: 'rgba(255,255,255,.4)', marginBottom: '.35rem', fontWeight: 600 }}>Credits</div><input style={inp} name="credits" type="number" placeholder="3" onChange={handleForm} /></div>
                <div><div style={{ fontSize: '.68rem', color: 'rgba(255,255,255,.4)', marginBottom: '.35rem', fontWeight: 600 }}>Year</div>
                  <select style={inp} name="year" onChange={handleForm}>
                    {['Year 1','Year 2','Year 3','Year 4'].map(y => <option key={y} style={{ background: '#1a1d27', color: '#f1f5f9' }}>{y}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '.7rem', justifyContent: 'flex-end' }}>
                <button onClick={closeModal} style={{ background: 'rgba(255,255,255,.08)', color: 'rgba(255,255,255,.6)', border: '1px solid rgba(255,255,255,.12)', borderRadius: 11, padding: '.55rem 1.1rem', fontSize: '.84rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'all .2s ease', backdropFilter: 'blur(10px)' }}
                  onMouseEnter={e => (e.target.style.background = 'rgba(255,255,255,.15)')}
                  onMouseLeave={e => (e.target.style.background = 'rgba(255,255,255,.08)')}
                >Cancel</button>
                <button onClick={addSubject} style={btnPrimary}
                  onMouseEnter={e => (e.target.style.transform = 'translateY(-2px)', e.target.style.boxShadow = '0 12px 32px rgba(99,102,241,.35)')}
                  onMouseLeave={e => (e.target.style.transform = 'translateY(0)', e.target.style.boxShadow = '0 8px 24px rgba(99,102,241,.25)')}
                >Add Subject</button>
              </div>
            </>}

            {modal === 'assignment' && <>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.3rem', color: 'var(--text)' }}>📋 Add Assignment</h3>
              <div style={{ marginBottom: '.85rem' }}><div style={{ fontSize: '.68rem', color: 'rgba(255,255,255,.4)', marginBottom: '.35rem', fontWeight: 600 }}>Title</div><input style={inp} name="title" placeholder="e.g. Linked List Implementation" onChange={handleForm} /></div>
              <div style={{ marginBottom: '.85rem' }}><div style={{ fontSize: '.68rem', color: 'rgba(255,255,255,.4)', marginBottom: '.35rem', fontWeight: 600 }}>Description</div><input style={inp} name="desc" placeholder="Brief description..." onChange={handleForm} /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.85rem', marginBottom: '1rem' }}>
                <div><div style={{ fontSize: '.68rem', color: 'rgba(255,255,255,.4)', marginBottom: '.35rem', fontWeight: 600 }}>Subject</div><input style={inp} name="subject" placeholder="e.g. Data Structures" onChange={handleForm} /></div>
                <div><div style={{ fontSize: '.68rem', color: 'rgba(255,255,255,.4)', marginBottom: '.35rem', fontWeight: 600 }}>Due Date</div><input style={inp} name="due" type="date" onChange={handleForm} /></div>
              </div>
              <div style={{ display: 'flex', gap: '.7rem', justifyContent: 'flex-end' }}>
                <button onClick={closeModal} style={{ background: 'rgba(255,255,255,.08)', color: 'rgba(255,255,255,.6)', border: '1px solid rgba(255,255,255,.12)', borderRadius: 11, padding: '.55rem 1.1rem', fontSize: '.84rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'all .2s ease', backdropFilter: 'blur(10px)' }}
                  onMouseEnter={e => (e.target.style.background = 'rgba(255,255,255,.15)')}
                  onMouseLeave={e => (e.target.style.background = 'rgba(255,255,255,.08)')}
                >Cancel</button>
                <button onClick={addAssignment} style={btnPrimary}
                  onMouseEnter={e => (e.target.style.transform = 'translateY(-2px)', e.target.style.boxShadow = '0 12px 32px rgba(99,102,241,.35)')}
                  onMouseLeave={e => (e.target.style.transform = 'translateY(0)', e.target.style.boxShadow = '0 8px 24px rgba(99,102,241,.25)')}
                >Post Assignment</button>
              </div>
            </>}

            {modal === 'link' && <>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.3rem', color: 'var(--text)' }}>🔗 Add University Link</h3>
              <div style={{ marginBottom: '.85rem' }}><div style={{ fontSize: '.68rem', color: 'rgba(255,255,255,.4)', marginBottom: '.35rem', fontWeight: 600 }}>Link Name</div><input style={inp} name="name" placeholder="e.g. Student Portal" onChange={handleForm} /></div>
              <div style={{ marginBottom: '.85rem' }}><div style={{ fontSize: '.68rem', color: 'rgba(255,255,255,.4)', marginBottom: '.35rem', fontWeight: 600 }}>URL</div><input style={inp} name="url" placeholder="https://..." onChange={handleForm} /></div>
              <div style={{ marginBottom: '1rem' }}><div style={{ fontSize: '.68rem', color: 'rgba(255,255,255,.4)', marginBottom: '.35rem', fontWeight: 600 }}>Icon (emoji)</div><input style={{ ...inp, width: 90, marginBottom: 0 }} name="icon" placeholder="🎓" onChange={handleForm} /></div>
              <div style={{ display: 'flex', gap: '.7rem', justifyContent: 'flex-end' }}>
                <button onClick={closeModal} style={{ background: 'rgba(255,255,255,.08)', color: 'rgba(255,255,255,.6)', border: '1px solid rgba(255,255,255,.12)', borderRadius: 11, padding: '.55rem 1.1rem', fontSize: '.84rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'all .2s ease', backdropFilter: 'blur(10px)' }}
                  onMouseEnter={e => (e.target.style.background = 'rgba(255,255,255,.15)')}
                  onMouseLeave={e => (e.target.style.background = 'rgba(255,255,255,.08)')}
                >Cancel</button>
                <button onClick={addLink} style={btnPrimary}
                  onMouseEnter={e => (e.target.style.transform = 'translateY(-2px)', e.target.style.boxShadow = '0 12px 32px rgba(99,102,241,.35)')}
                  onMouseLeave={e => (e.target.style.transform = 'translateY(0)', e.target.style.boxShadow = '0 8px 24px rgba(99,102,241,.25)')}
                >Add Link</button>
              </div>
            </>}
          </div>
        </div>
      )}

      {/* UPLOAD MODAL */}
      {uploadModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.75)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: 'rgba(15,17,30,.95)', backdropFilter: 'blur(20px)', border: '1.5px solid rgba(255,255,255,.15)', borderRadius: 18, padding: 'clamp(1rem, 5vw, 2rem)', width: '100%', maxWidth: 'min(480px, 90vw)', fontFamily: 'inherit', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,.3)' }}>
            <h3 style={{ fontSize: 'clamp(1rem, 4vw, 1.1rem)', fontWeight: 700, marginBottom: '.8rem', color: 'var(--text)' }}>
              {uploadModal === 'summary' ? '📄 Add Summary' : uploadModal === 'exam' ? '📝 Add Exam' : uploadModal === 'video' ? '🎥 Add Video' : '🖼️ Add Image'}
            </h3>
            <div style={{ fontSize: 'clamp(.7rem, 2vw, .76rem)', color: 'rgba(255,255,255,.4)', marginBottom: '1.2rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,.1)' }}>{uploadSubject?.name}</div>
            
            {error && <div style={{ background: 'rgba(248,113,113,.15)', border: '1px solid rgba(248,113,113,.2)', color: '#f87171', padding: '.75rem', borderRadius: 10, marginBottom: '.85rem', fontSize: '.8rem', display: 'flex', alignItems: 'center', gap: '.5rem' }}>⚠️ {error}</div>}
            
            {uploadModal !== 'image' && (
              <div style={{ marginBottom: '.85rem' }}>
                <label style={{ fontSize: 'clamp(.65rem, 1.5vw, .68rem)', color: 'rgba(255,255,255,.4)', marginBottom: '.35rem', fontWeight: 600, display: 'block' }}>Title</label>
                <input value={uploadTitle} onChange={e => setUploadTitle(e.target.value)} placeholder={uploadModal === 'video' ? 'e.g. Lecture 3 — Linked Lists' : 'e.g. Chapter 3 Summary'} style={{ ...inp, marginBottom: 0 }} 
                  onFocus={e => (e.target.style.background = 'rgba(255,255,255,.12)', e.target.style.borderColor = 'rgba(129,140,248,.3)')}
                  onBlur={e => (e.target.style.background = 'rgba(255,255,255,.08)', e.target.style.borderColor = 'rgba(255,255,255,.12)')}
                />
              </div>
            )}
            {uploadModal === 'video' ? (
              <div style={{ marginBottom: '.85rem' }}>
                <label style={{ fontSize: 'clamp(.65rem, 1.5vw, .68rem)', color: 'rgba(255,255,255,.4)', marginBottom: '.35rem', fontWeight: 600, display: 'block' }}>YouTube URL</label>
                <input value={uploadUrl} onChange={e => setUploadUrl(e.target.value)} placeholder="https://youtu.be/..." style={{ ...inp, marginBottom: 0 }}
                  onFocus={e => (e.target.style.background = 'rgba(255,255,255,.12)', e.target.style.borderColor = 'rgba(129,140,248,.3)')}
                  onBlur={e => (e.target.style.background = 'rgba(255,255,255,.08)', e.target.style.borderColor = 'rgba(255,255,255,.12)')}
                />
              </div>
            ) : (
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ fontSize: 'clamp(.65rem, 1.5vw, .68rem)', color: 'rgba(255,255,255,.4)', marginBottom: '.35rem', fontWeight: 600, display: 'block' }}>{uploadModal === 'image' ? 'Image (JPG/PNG)' : 'PDF File'}</label>
                <input type="file" accept={uploadModal === 'image' ? 'image/*' : '.pdf'} onChange={e => setUploadFile(e.target.files[0])} style={{ ...inp, marginBottom: 0, padding: '.6rem', color: 'var(--text)', fontSize: '.8rem' }} />
                {uploadFile && <div style={{ fontSize: '.7rem', color: 'rgba(52,211,153,.7)', marginTop: '.4rem' }}>✓ {uploadFile.name}</div>}
              </div>
            )}
            <div style={{ display: 'flex', gap: '.6rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <button onClick={closeUploadModal} disabled={uploading} style={{ background: 'rgba(255,255,255,.08)', color: 'rgba(255,255,255,.6)', border: '1px solid rgba(255,255,255,.12)', borderRadius: 10, padding: '.6rem 1.1rem', fontSize: '.82rem', fontWeight: 600, cursor: uploading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', transition: 'all .2s ease', backdropFilter: 'blur(10px)', opacity: uploading ? .5 : 1 }}
                onMouseEnter={e => !uploading && (e.target.style.background = 'rgba(255,255,255,.15)')}
                onMouseLeave={e => (e.target.style.background = 'rgba(255,255,255,.08)')}
              >Cancel</button>
              <button onClick={handleUpload} disabled={uploading} style={{ ...btnPrimary, opacity: uploading ? .7 : 1, pointerEvents: uploading ? 'none' : 'auto', padding: '.6rem 1.5rem', fontSize: '.82rem' }}
                onMouseEnter={e => !uploading && (e.target.style.transform = 'translateY(-2px)', e.target.style.boxShadow = '0 12px 32px rgba(99,102,241,.35)')}
                onMouseLeave={e => (e.target.style.transform = 'translateY(0)', e.target.style.boxShadow = '0 8px 24px rgba(99,102,241,.25)')}
              >
                {uploading ? '⏳ Uploading...' : uploadModal === 'video' ? '🎥 Add Video' : (uploadModal === 'image' ? '🖼️ Upload Image' : '📤 Upload')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}