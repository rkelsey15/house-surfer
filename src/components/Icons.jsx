// Icons copied from the design prototype. They use `currentColor`, so they
// follow the text color and work in light and dark mode.
const base = {
  className: 'ico',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.9,
  'aria-hidden': true,
}

export const SurfIcon = () => (
  <svg {...base}>
    <rect x="5" y="3" width="14" height="18" rx="3" />
    <path d="M9 17h6" />
  </svg>
)

export const MapIcon = () => (
  <svg {...base} strokeLinejoin="round">
    <path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2z" />
    <path d="M9 4v14M15 6v14" />
  </svg>
)

export const CameraIcon = () => (
  <svg {...base} strokeWidth={2}>
    <path d="M4 8h3l2-3h6l2 3h3v11H4z" strokeLinejoin="round" />
    <circle cx="12" cy="13" r="3.5" />
  </svg>
)

export const TopIcon = () => (
  <svg {...base}>
    <path d="M5 20V10M12 20V4M19 20v-7" />
  </svg>
)

export const ProfileIcon = () => (
  <svg {...base}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" />
  </svg>
)

export const HouseFillIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M3 11 12 4l9 7v9h-6v-6H9v6H3z" />
  </svg>
)
