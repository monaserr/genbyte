export default function Sidebar({ items, active, onSelect, isOpen, isAdmin = false }) {
  return (
    <>
      {/* OVERLAY للموبايل */}
      {isOpen && (
        <div
          onClick={() => onSelect(active)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', zIndex: 199 }}
        />
      )}

      <div style={{
        padding: '.85rem .65rem',
        position: 'fixed',
        top: 62,
        left: 0,
        height: 'calc(100vh - 62px)',
        width: 220,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        background: 'rgba(255,255,255,.02)',
        borderRight: '1px solid rgba(255,255,255,.06)',
        backdropFilter: 'blur(20px)',
        zIndex: 200,
        transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform .3s ease',
        fontFamily: 'Inter, system-ui, sans-serif'
      }}>
        {items.map((item, i) => {
          if (item.type === 'section') return (
            <div key={i} style={{ fontSize: '.6rem', fontWeight: 600, color: 'rgba(255,255,255,.28)', letterSpacing: '.12em', textTransform: 'uppercase', padding: '.6rem .65rem .3rem', marginTop: '.3rem' }}>
              {item.label}
            </div>
          )
          if (item.type === 'spacer') return <div key={i} style={{ flex: 1 }} />
          return (
            <button
              key={i}
              onClick={() => onSelect(item.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '.65rem',
                padding: '.58rem .75rem', borderRadius: 10,
                cursor: 'pointer', fontSize: '.82rem',
                color: active === item.id ? (isAdmin ? '#a855f7' : '#818cf8') : 'rgba(255,255,255,.45)',
                border: active === item.id ? `1px solid ${isAdmin ? 'rgba(124,58,237,.25)' : 'rgba(129,140,248,.2)'}` : '1px solid transparent',
                background: active === item.id ? (isAdmin ? 'rgba(124,58,237,.2)' : 'rgba(129,140,248,.15)') : 'none',
                width: '100%', textAlign: 'left', fontWeight: active === item.id ? 500 : 400,
                fontFamily: 'inherit', transition: 'all .2s',
              }}
            >
              <span style={{ fontSize: '.9rem', width: 18, textAlign: 'center', flexShrink: 0 }}>{item.icon}</span>
              {item.label}
              {item.badge && (
                <span style={{ marginLeft: 'auto', background: item.badgeColor || '#f87171', color: '#fff', fontSize: '.58rem', borderRadius: 99, padding: '.1rem .42rem', fontWeight: 700 }}>
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