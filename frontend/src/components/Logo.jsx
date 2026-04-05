export default function Logo({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 72 72" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="lg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#6366f1"/>
          <stop offset="100%" stopColor="#06b6d4"/>
        </linearGradient>
      </defs>
      <rect width="72" height="72" rx="16" fill="#0f1117"/>
      <polygon points="36,8 58,20 58,44 36,56 14,44 14,20" fill="none" stroke="url(#lg)" strokeWidth="2"/>
      <polygon points="36,16 52,25 52,43 36,52 20,43 20,25" fill="rgba(99,102,241,.15)" stroke="rgba(99,102,241,.3)" strokeWidth="1"/>
      <text x="36" y="41" textAnchor="middle" fontFamily="Inter,system-ui,sans-serif" fontWeight="800" fontSize="20" fill="white">G</text>
      <circle cx="58" cy="20" r="4" fill="#818cf8"/>
    </svg>
  )
}