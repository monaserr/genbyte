export default function Sidebar({ items, active, onSelect, isOpen, isAdmin = false }) {
  return (
    <>
      {/* OVERLAY للموبايل */}
      {isOpen && (
        <div
          onClick={() => onSelect(active)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.6)', zIndex: 199, backdropFilter: 'blur(4px)' }}
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
        background: 'rgba(7,8,15,.4)',
        borderRight: '1px solid rgba(255,255,255,.08)',
        backdropFilter: 'blur(30px)',
        WebkitBackdropFilter: 'blur(30px)',
        zIndex: 200,
        transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform .3s ease',
        fontFamily: 'Inter, system-ui, sans-serif'
      }}>
        {items.map((item, i) => {
          if (item.type === 'section') return (
            <div key={i} style={{ fontSize: '.62rem', fontWeight: 700, color: 'rgba(255,255,255,.32)', letterSpacing: '.1em', textTransform: 'uppercase', padding: '.7rem .75rem .4rem', marginTop: '.4rem' }}>
              {item.label}
            </div>
          )
          if (item.type === 'spacer') return <div key={i} style={{ flex: 1 }} />
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
                color: active === item.id ? (isAdmin ? '#a855f7' : '#818cf8') : 'rgba(255,255,255,.5)',
                border: active === item.id ? `1.5px solid ${isAdmin ? 'rgba(168,85,247,.3)' : 'rgba(129,140,248,.3)'}` : '1px solid transparent',
                background: active === item.id ? (isAdmin ? 'rgba(124,58,237,.15)' : 'rgba(129,140,248,.12)') : 'rgba(255,255,255,.04)',
                width: '100%',
                textAlign: 'left',
                fontWeight: active === item.id ? 600 : 500,
                fontFamily: 'inherit',
                transition: 'all .2s ease',
                backdropFilter: 'blur(10px)',
              }}
              onMouseEnter={e => {
                if (active !== item.id) {
                  e.target.style.background = 'rgba(255,255,255,.08)'
                  e.target.style.color = 'rgba(255,255,255,.7)'
                }
              }}
              onMouseLeave={e => {
                if (active !== item.id) {
                  e.target.style.background = 'rgba(255,255,255,.04)'
                  e.target.style.color = 'rgba(255,255,255,.5)'
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