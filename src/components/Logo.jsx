export default function Logo({ center = false }) {
  return (
    <div className="logo" style={center ? { justifyContent: 'center' } : undefined}>
      <div className="logo-mark">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinejoin="round" aria-hidden="true">
          <path d="M3 12 12 5l9 7" />
          <path d="M2 19c3-2 5-2 7 0s4 2 6 0 4-2 7 0" />
        </svg>
      </div>
      House Surfer
    </div>
  )
}
