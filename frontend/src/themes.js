export const colors = {
  dark: {
    bg: '#0a1a0f',
    bg2: '#0f2214',
    surface: '#142d1a',
    border: '#1e4226',
    text: '#e8f5e9',
    text90: 'rgba(232,245,233,.9)',
    text70: 'rgba(232,245,233,.7)',
    text50: 'rgba(232,245,233,.5)',
    text40: 'rgba(232,245,233,.4)',
    text30: 'rgba(232,245,233,.3)',
    text20: 'rgba(232,245,233,.2)',
    text12: 'rgba(72,199,116,.12)',
    text08: 'rgba(72,199,116,.08)',
    text06: 'rgba(72,199,116,.06)',
    muted: '#6abf7a',
    accent: '#48c774',
    accent2: '#34a85a',
    accentLight: 'rgba(72,199,116,.12)',
    navBg: 'rgba(10,26,15,.88)',
    navBorder: 'rgba(30,66,38,.9)',
    sidebarBg: 'rgba(10,26,15,.80)',
    sidebarBorder: 'rgba(30,66,38,.8)',
  },
  light: {
    bg: '#f0ecf8',
    bg2: '#e8e0f5',
    surface: '#ffffff',
    border: '#c9b8e8',
    text: '#000000',
    text90: 'rgba(0,0,0,.9)',
    text70: 'rgba(0,0,0,.7)',
    text50: 'rgba(0,0,0,.5)',
    text40: 'rgba(0,0,0,.4)',
    text30: 'rgba(0,0,0,.3)',
    text20: 'rgba(0,0,0,.2)',
    text12: 'rgba(70,2,115,.12)',
    text08: 'rgba(70,2,115,.08)',
    text06: 'rgba(70,2,115,.06)',
    muted: '#333333',
    accent: '#460273',
    accent2: '#5a0399',
    accentLight: 'rgba(70,2,115,.08)',
    navBg: 'rgba(240,236,248,.95)',
    navBorder: '#c9b8e8',
    sidebarBg: 'rgba(240,236,248,.92)',
    sidebarBorder: '#c9b8e8',
  }
}

export const isLightMode = () => {
  if (typeof window === 'undefined') return false
  return document.documentElement.getAttribute('data-theme') === 'light'
}

export const getTheme = () => isLightMode() ? colors.light : colors.dark

export const getColor = (colorName) => {
  const theme = getTheme()
  return theme[colorName] || '#e8f5e9'
}

export default colors
