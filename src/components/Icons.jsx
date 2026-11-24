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

export const ArrowRightIcon = () => (
  <svg {...base} className="ico ico-sm">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)

// ---- Badge icons (Part G): same 24 px grid, 2 px line, round ends ----

// First Steps: two footprints, one a step ahead of the other.
export const FootprintsIcon = () => (
  <svg {...base}>
    <ellipse cx="8" cy="7.5" rx="2.5" ry="3.5" />
    <ellipse cx="8" cy="15" rx="2" ry="2" />
    <ellipse cx="16" cy="12" rx="2.5" ry="3.5" />
    <ellipse cx="16" cy="19.5" rx="2" ry="2" />
  </svg>
)

// Block Walker: a map pin standing on a street.
export const PinStreetIcon = () => (
  <svg {...base}>
    <path d="M12 2.5a5.5 5.5 0 0 1 5.5 5.5c0 3.8-5.5 8.5-5.5 8.5S6.5 11.8 6.5 8A5.5 5.5 0 0 1 12 2.5z" />
    <circle cx="12" cy="8" r="1.8" />
    <path d="M3 21h18" />
  </svg>
)

// Good Neighbor Voice: a speech bubble with a house in it.
export const SpeechHouseIcon = () => (
  <svg {...base}>
    <path d="M5 4h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-8l-4 4v-4H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
    <path d="m8.5 11.5 3.5-3 3.5 3M9.5 10.5V14h5v-3.5" />
  </svg>
)

// Crowd Favorite: a heart.
export const HeartIcon = () => (
  <svg {...base}>
    <path d="M12 20.5s-8.5-4.8-8.5-10.7A4.6 4.6 0 0 1 12 7.2a4.6 4.6 0 0 1 8.5 2.6c0 5.9-8.5 10.7-8.5 10.7z" />
  </svg>
)

// Surfer Elite: a star riding a wave (the House Surfer wave, plus a star for "elite").
export const WaveStarIcon = () => (
  <svg {...base}>
    <path d="m12 2.5 1.9 3.9 4.3.6-3.1 3 .7 4.3-3.8-2-3.8 2 .7-4.3-3.1-3 4.3-.6z" />
    <path d="M3 19.5c2.25-2.2 3.75-2.2 6 0s3.75 2.2 6 0 3.75-2.2 6 0" />
  </svg>
)
