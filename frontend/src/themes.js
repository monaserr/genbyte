export const colors = {
  dark: {
    bg: '#080600',
    bg2: '#0d0a00',
    surface: '#120e00',
    border: '#2a2200',
    text: '#f5f0e0',
    text90: 'rgba(245,240,224,.9)',
    text70: 'rgba(245,240,224,.7)',
    text50: 'rgba(245,240,224,.5)',
    text40: 'rgba(245,240,224,.4)',
    text30: 'rgba(245,240,224,.3)',
    text20: 'rgba(245,240,224,.2)',
    text12: 'rgba(212,160,23,.12)',
    text08: 'rgba(212,160,23,.08)',
    text06: 'rgba(212,160,23,.06)',
    muted: '#8a7a50',
    accent: '#d4a017',
    accent2: '#a07810',
    accentLight: 'rgba(212,160,23,.08)',
    navBg: 'rgba(12,10,0,.85)',
    navBorder: '#2a2200',
    sidebarBg: 'rgba(12,10,0,.75)',
    sidebarBorder: '#2a2200',
  },
  light: {
    bg: '#fffdf5',
    bg2: '#fdf8e8',
    surface: '#ffffff',
    border: '#f0e0a0',
    text: '#1c1810',
    text90: 'rgba(28,24,16,.9)',
    text70: 'rgba(28,24,16,.7)',
    text50: 'rgba(28,24,16,.5)',
    text40: 'rgba(28,24,16,.4)',
    text30: 'rgba(28,24,16,.3)',
    text20: 'rgba(28,24,16,.2)',
    text12: 'rgba(28,24,16,.12)',
    text08: 'rgba(28,24,16,.08)',
    text06: 'rgba(28,24,16,.06)',
    muted: '#8a7040',
    accent: '#92400e',
    accent2: '#78340b',
    accentLight: 'rgba(146,64,14,.08)',
    navBg: 'rgba(255,253,245,.95)',
    navBorder: '#f0e0a0',
    sidebarBg: 'rgba(255,253,245,.92)',
    sidebarBorder: '#f0e0a0',
  }
}

export const isLightMode = () => {
  if (typeof window === 'undefined') return false
  return document.documentElement.getAttribute('data-theme') === 'light'
}

export const getTheme = () => isLightMode() ? colors.light : colors.dark

export const getColor = (colorName) => {
  const theme = getTheme()
  return theme[colorName] || '#f5f0e0'
}

export default colors