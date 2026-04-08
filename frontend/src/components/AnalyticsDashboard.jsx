import { motion } from 'framer-motion'
import { useMemo } from 'react'
import { StaggerContainer, StaggerItem, MotionCard } from './Motion'

/**
 * Analytics Dashboard Component
 * Displays comprehensive analytics with charts and stats
 */
export function AnalyticsDashboard({
  users = [],
  subjects = [],
  theme = 'dark'
}) {
  const isDark = theme === 'dark'

  const stats = useMemo(() => ({
    totalUsers: users.length,
    totalSubjects: subjects.length,
    totalContent: subjects.reduce((sum, s) => {
      return sum + (s.summaries?.length || 0) + (s.exams?.length || 0) + (s.videos?.length || 0)
    }, 0),
    usersByYear: {
      'Year 1': users.filter(u => u.year === 'Year 1').length,
      'Year 2': users.filter(u => u.year === 'Year 2').length,
      'Year 3': users.filter(u => u.year === 'Year 3').length,
      'Year 4': users.filter(u => u.year === 'Year 4').length
    },
    usersByRole: {
      'admin': users.filter(u => u.role === 'admin').length,
      'student': users.filter(u => u.role === 'student').length
    }
  }), [users, subjects])

  const StatCard = ({ label, value, color, icon, delay = 0 }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      whileHover={{ y: -4, boxShadow: isDark ? '0 12px 24px rgba(0,168,168,.12)' : '0 12px 24px rgba(11,60,93,.15)' }}
      style={{
        background: isDark ? 'rgba(255,255,255,.06)' : 'rgba(255,255,255,.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: isDark ? '1px solid rgba(255,255,255,.12)' : '1px solid rgba(11,60,93,.12)',
        borderRadius: 16,
        padding: '1.5rem',
        transition: 'all .2s ease'
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '0.75rem'
      }}>
        <span style={{ fontSize: '1.2rem' }}>{icon}</span>
        <span style={{ color, fontWeight: 600, fontSize: '.7rem' }}>↑ Active</span>
      </div>
      <div style={{ fontSize: '2rem', fontWeight: 800, color, marginBottom: '0.5rem' }}>
        {value}
      </div>
      <div style={{
        fontSize: '.85rem',
        color: isDark ? 'rgba(255,255,255,.5)' : 'rgba(11,60,93,.6)',
        fontWeight: 500
      }}>
        {label}
      </div>
    </motion.div>
  )

  const ProgressBar = ({ label, value, max, color, percentage }) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      style={{ marginBottom: '1.2rem' }}
    >
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '0.5rem'
      }}>
        <span style={{
          fontSize: '.9rem',
          fontWeight: 500,
          color: isDark ? 'rgba(255,255,255,.7)' : 'rgba(11,60,93,.8)'
        }}>
          {label}
        </span>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <span style={{
            fontSize: '.8rem',
            color: isDark ? 'rgba(255,255,255,.4)' : 'rgba(11,60,93,.5)',
            fontWeight: 600
          }}>
            {value}
          </span>
          <span style={{
            fontSize: '.7rem',
            color: isDark ? 'rgba(255,255,255,.25)' : 'rgba(11,60,93,.35)',
            fontWeight: 500
          }}>
            {percentage}%
          </span>
        </div>
      </div>
      <div style={{
        height: 8,
        background: isDark ? 'rgba(255,255,255,.08)' : 'rgba(11,60,93,.08)',
        borderRadius: 99,
        overflow: 'hidden'
      }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ delay: 0.3, duration: 0.6, ease: 'easeOut' }}
          style={{
            height: '100%',
            background: color,
            borderRadius: 99
          }}
        />
      </div>
    </motion.div>
  )

  return (
    <div>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        style={{ marginBottom: '2rem' }}
      >
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: 700,
          marginBottom: '0.5rem'
        }}>
          📈 Analytics Dashboard
        </h2>
        <p style={{
          fontSize: '.9rem',
          color: isDark ? 'rgba(255,255,255,.45)' : 'rgba(11,60,93,.6)',
          marginTop: '0.25rem'
        }}>
          Real-time platform metrics and insights
        </p>
      </motion.div>

      {/* Stats Grid */}
      <StaggerContainer delay={0.1}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <StaggerItem>
            <StatCard
              label="Total Users"
              value={stats.totalUsers}
              icon="👥"
              color="#00a8a8"
              delay={0}
            />
          </StaggerItem>
          <StaggerItem>
            <StatCard
              label="Active Subjects"
              value={stats.totalSubjects}
              icon="📚"
              color="#7ed957"
              delay={0.1}
            />
          </StaggerItem>
          <StaggerItem>
            <StatCard
              label="Total Content"
              value={stats.totalContent}
              icon="📄"
              color="#818cf8"
              delay={0.2}
            />
          </StaggerItem>
          <StaggerItem>
            <StatCard
              label="Admin Count"
              value={stats.usersByRole.admin}
              icon="🔐"
              color="#f87171"
              delay={0.3}
            />
          </StaggerItem>
        </div>
      </StaggerContainer>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.5rem'
      }}>

        {/* Users by Year */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          whileHover={{ y: -4 }}
          style={{
            background: isDark ? 'rgba(255,255,255,.06)' : 'rgba(255,255,255,.85)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: isDark ? '1px solid rgba(255,255,255,.12)' : '1px solid rgba(11,60,93,.12)',
            borderRadius: 16,
            padding: '1.5rem',
            transition: 'all .2s ease'
          }}
        >
          <h3 style={{
            fontSize: '1.1rem',
            fontWeight: 700,
            marginBottom: '1.2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            📊 Users by Year
          </h3>
          <StaggerContainer>
            {Object.entries(stats.usersByYear).map(([year, count], idx) => {
              const total = stats.totalUsers
              const percentage = total > 0 ? Math.round((count / total) * 100) : 0
              const colors = ['#00a8a8', '#7ed957', '#818cf8', '#f87171']
              return (
                <StaggerItem key={year}>
                  <ProgressBar
                    label={year}
                    value={count}
                    max={total}
                    color={colors[idx]}
                    percentage={percentage}
                  />
                </StaggerItem>
              )
            })}
          </StaggerContainer>
        </motion.div>

        {/* User Roles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.3 }}
          whileHover={{ y: -4 }}
          style={{
            background: isDark ? 'rgba(255,255,255,.06)' : 'rgba(255,255,255,.85)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: isDark ? '1px solid rgba(255,255,255,.12)' : '1px solid rgba(11,60,93,.12)',
            borderRadius: 16,
            padding: '1.5rem',
            transition: 'all .2s ease'
          }}
        >
          <h3 style={{
            fontSize: '1.1rem',
            fontWeight: 700,
            marginBottom: '1.2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            🔐 User Roles
          </h3>
          <StaggerContainer>
            {Object.entries(stats.usersByRole).map(([role, count], idx) => {
              const total = stats.totalUsers
              const percentage = total > 0 ? Math.round((count / total) * 100) : 0
              const colors = ['#a855f7', '#34d399']
              return (
                <StaggerItem key={role}>
                  <ProgressBar
                    label={role === 'admin' ? '👤 Admins' : '👥 Students'}
                    value={count}
                    max={total}
                    color={colors[idx]}
                    percentage={percentage}
                  />
                </StaggerItem>
              )
            })}
          </StaggerContainer>
        </motion.div>

      </div>

      {/* Content Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.3 }}
        style={{
          marginTop: '1.5rem',
          background: isDark ? 'rgba(255,255,255,.06)' : 'rgba(255,255,255,.85)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: isDark ? '1px solid rgba(255,255,255,.12)' : '1px solid rgba(11,60,93,.12)',
          borderRadius: 16,
          padding: '1.5rem',
          transition: 'all .2s ease'
        }}
        whileHover={{ y: -4 }}
      >
        <h3 style={{
          fontSize: '1.1rem',
          fontWeight: 700,
          marginBottom: '1.2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          📚 Subject Overview
        </h3>
        {subjects.length === 0 ? (
          <div style={{
            textAlign: 'center',
            color: isDark ? 'rgba(255,255,255,.35)' : 'rgba(11,60,93,.5)',
            padding: '1rem',
            fontSize: '.9rem'
          }}>
            No subjects created yet
          </div>
        ) : (
          <StaggerContainer>
            {subjects.slice(0, 5).map((subject, idx) => {
              const contentCount = (subject.summaries?.length || 0) + (subject.exams?.length || 0) + (subject.videos?.length || 0)
              return (
                <StaggerItem key={subject._id}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '0.75rem 0',
                    borderBottom: isDark ? '1px solid rgba(255,255,255,.05)' : '1px solid rgba(11,60,93,.08)',
                    ':last-child': { borderBottom: 'none' }
                  }}>
                    <div style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      background: subject.color || 'rgba(129,140,248,.12)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.2rem',
                      flexShrink: 0
                    }}>
                      {subject.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontSize: '.9rem',
                        fontWeight: 600,
                        color: isDark ? 'rgba(255,255,255,.8)' : 'rgba(11,60,93,.8)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {subject.name}
                      </div>
                      <div style={{
                        fontSize: '.75rem',
                        color: isDark ? 'rgba(255,255,255,.35)' : 'rgba(11,60,93,.45)',
                        marginTop: '0.25rem'
                      }}>
                        {contentCount} content items
                      </div>
                    </div>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2 + idx * 0.1, type: 'spring' }}
                      style={{
                        background: '#7ed957',
                        color: '#0B3C5D',
                        borderRadius: 99,
                        padding: '0.25rem 0.75rem',
                        fontSize: '.7rem',
                        fontWeight: 700,
                        flexShrink: 0
                      }}
                    >
                      {contentCount}
                    </motion.div>
                  </div>
                </StaggerItem>
              )
            })}
          </StaggerContainer>
        )}
      </motion.div>
    </div>
  )
}

export default AnalyticsDashboard
