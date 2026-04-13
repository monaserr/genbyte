import { useState, useEffect } from 'react'

export default function Sidebar({ items, active, onSelect, isOpen, isAdmin = false }) {
  // ✅ بيتابع تغيير الـ theme بشكل ديناميكي
  const [isDark, setIsDark] = useState(
    document.documentElement.getAttribute('data-theme') !== 'light'
  )

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.getAttribute('data-theme') !== 'light')
    })
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    return () => observer.disconnect()
  }, [])

  // ✅ 2 & 3: ألوان القايمة
  // دارك: باك أخضر + خط أبيض
  // لايت: باك أزرق فاتح + خط أبيض
  const sidebarBg = isDark
    ? 'rgba(10,60,20,.80)'
    : 'rgba(30,100,220,.15)'

  const sidebarBorder = isDark
    ? 'rgba(50,180,80,.35)'
    : 'rgba(30,100,220,.25)'

  const itemActiveBg = isDark
    ? 'rgba(30,140,60,.60)'
    : 'rgba(30,100,220,.75)'

  const itemActiveBorder = isDark
    ? 'rgba(60,200,90,.5)'
    : 'rgba(30,100,220,.5)'

  const itemHoverBg = isDark
    ? 'rgba(20,100,40,.45)'
    : 'rgba(30,100,220,.35)'

  // ✅ 1: كل النصوص في اللايت أسود — ما عدا الـ active اللي خطه أبيض
  // ✅ 2 & 3: نص الـ active أبيض في الاتنين
  const itemActiveColor  = '#ffffff'
  const itemNormalColor  = isDark ? 'rgba(255,255,255,.7)' : '#000000'
  const itemHoverColor   = isDark ? '#ffffff' : '#ffffff'
  const sectionColor     = isDark ? 'rgba(255,255,255,.4)' : '#000000'

  return (
    <>
      {/* OVERLAY موبايل */}
      {isOpen && (
        <div
          onClick={() => onSelect(active)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.55)', zIndex: 199, backdropFilter: 'blur(4px)' }}
        />
      )}

      <div style={{
        padding: '1rem .75rem',
        position: 'fixed',
        top: 62,
        left: 0,
        height: 'calc(100vh - 62px)',
        width: 220,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        background: sidebarBg,
        borderRight: `1px solid ${sidebarBorder}`,
        backdropFilter: 'blur(30px)',
        WebkitBackdropFilter: 'blur(30px)',
        zIndex: 200,
        transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform .3s ease',
        fontFamily: 'Inter, system-ui, sans-serif'
      }}>
        {items.map((item, i) => {
          if (item.type === 'section') return (
            <div key={i} style={{
              fontSize: '.62rem',
              fontWeight: 700,
              color: sectionColor,
              letterSpacing: '.1em',
              textTransform: 'uppercase',
              padding: '.7rem .75rem .4rem',
              marginTop: '.4rem'
            }}>
              {item.label}
            </div>
          )
          if (item.type === 'spacer') return <div key={i} style={{ flex: 1 }} />

          const isActive = active === item.id
          return (
            <button
              key={i}
              onClick={() => onSelect(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '.7rem',
                padding: '.65rem .85rem',
                borderRadius: 11,
                cursor: 'pointer',
                fontSize: '.84rem',
                color: isActive ? itemActiveColor : itemNormalColor,
                border: isActive ? `1.5px solid ${itemActiveBorder}` : '1px solid transparent',
                background: isActive ? itemActiveBg : 'transparent',
                width: '100%',
                textAlign: 'left',
                fontWeight: isActive ? 600 : 500,
                fontFamily: 'inherit',
                transition: 'all .2s ease',
              }}
              onMouseEnter={e => {
                if (!isActive) {
                  e.currentTarget.style.background = itemHoverBg
                  e.currentTarget.style.color = itemHoverColor
                }
              }}
              onMouseLeave={e => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.color = itemNormalColor
                }
              }}
            >
              <span style={{ fontSize: '.95rem', width: 18, textAlign: 'center', flexShrink: 0 }}>{item.icon}</span>
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.badge && (
                <span style={{
                  background: item.badgeColor || '#f87171',
                  color: '#fff',
                  fontSize: '.6rem',
                  borderRadius: 99,
                  padding: '.12rem .45rem',
                  fontWeight: 700,
                  flexShrink: 0
                }}>
                  {item.badge}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </>
  )
}
