/**
 * Theme utilities for dynamic color management
 * Handles light and dark mode color variations
 */

export const colors = {
  dark: {
    bg: '#09090b',
    bg2: '#111113',
    surface: '#18181b',
    border: '#27272a',
    text: '#fafafa',
    text90: 'rgba(250,250,250,.9)',
    text70: 'rgba(250,250,250,.7)',
    text50: 'rgba(250,250,250,.5)',
    text40: 'rgba(250,250,250,.4)',
    text30: 'rgba(250,250,250,.3)',
    text20: 'rgba(250,250,250,.2)',
    text12: 'rgba(255,255,255,.12)',
    text08: 'rgba(255,255,255,.08)',
    text06: 'rgba(255,255,255,.06)',
    muted: '#71717a',
    accent: '#a78bfa',
    accent2: '#7c3aed',
    accentLight: 'rgba(167,139,250,.08)',
    navBg: 'rgba(24,24,27,.8)',
    navBorder: '#27272a',
    sidebarBg: 'rgba(24,24,27,.7)',
    sidebarBorder: '#27272a',
  },
  light: {
    bg: '#f4f6fb',
    bg2: '#eaecf5',
    surface: '#ffffff',
    border: '#d1d5e8',
    text: '#0f172a',
    text90: 'rgba(15,23,42,.9)',
    text70: 'rgba(15,23,42,.7)',
    text50: 'rgba(15,23,42,.5)',
    text40: 'rgba(15,23,42,.4)',
    text30: 'rgba(15,23,42,.3)',
    text20: 'rgba(15,23,42,.2)',
    text12: 'rgba(15,23,42,.12)',
    text08: 'rgba(15,23,42,.08)',
    text06: 'rgba(15,23,42,.06)',
    muted: '#5b6a8a',
    accent: '#7c3aed',
    accent2: '#6d28d9',
    accentLight: 'rgba(124,58,237,.08)',
    navBg: 'rgba(255,255,255,.92)',
    navBorder: '#d1d5e8',
    sidebarBg: 'rgba(255,255,255,.90)',
    sidebarBorder: '#d1d5e8',
  }
}

// Check if light mode is enabled
export const isLightMode = () => {
  if (typeof window === 'undefined') return false
  return document.documentElement.getAttribute('data-theme') === 'light'
}

// Get current theme colors
export const getTheme = () => isLightMode() ? colors.light : colors.dark

// Color transition helper
export const getColor = (colorName) => {
  const theme = getTheme()
  return theme[colorName] || '#fafafa'
}

export default colors
