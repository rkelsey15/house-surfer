// One icon set: 24 px grid, 2 px line, round ends and joins, `currentColor` so
// every icon follows the text color in light and dark mode. Icons are
// decoration (aria-hidden); the button or link around them carries the name.
const base = {
  className: 'ico',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
}

export const SurfIcon = () => (
  <svg {...base}>
    <rect x="5" y="3" width="14" height="18" rx="3" />
    <path d="M9 17h6" />
  </svg>
)

export const MapIcon = () => (
  <svg {...base}>
    <path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2z" />
    <path d="M9 4v14M15 6v14" />
  </svg>
)

export const CameraIcon = () => (
  <svg {...base}>
    <path d="M4 8h3l2-3h6l2 3h3v11H4z" />
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

// Outline house, used as the profile picture.
export const HouseIcon = () => (
  <svg {...base} className="ico ico-lg">
    <path d="M3 11 12 4l9 7" />
    <path d="M5 10v10h14V10" />
    <path d="M10 20v-6h4v6" />
  </svg>
)

export const CloseIcon = () => (
  <svg {...base}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
)

export const ChevronDownIcon = () => (
  <svg {...base} className="ico ico-sm">
    <path d="m6 9 6 6 6-6" />
  </svg>
)

export const ArrowLeftIcon = () => (
  <svg {...base} className="ico ico-sm">
    <path d="M19 12H5M11 6l-6 6 6 6" />
  </svg>
)

// "Like" arrow on comments.
export const ArrowUpIcon = () => (
  <svg {...base} className="ico ico-sm">
    <path d="M12 19V5M6 11l6-6 6 6" />
  </svg>
)

export const CheckIcon = () => (
  <svg {...base} className="ico ico-sm" strokeWidth={3}>
    <path d="m5 12 5 5 9-10" />
  </svg>
)

export const LockIcon = () => (
  <svg {...base}>
    <rect x="5" y="11" width="14" height="10" rx="2" />
    <path d="M8 11V8a4 4 0 0 1 8 0v3" />
  </svg>
)
