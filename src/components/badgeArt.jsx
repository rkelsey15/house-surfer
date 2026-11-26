import { CameraIcon, FootprintsIcon, HeartIcon, PinStreetIcon, SpeechHouseIcon, WaveStarIcon } from './Icons.jsx'
import { BADGES } from '../lib/profileLists.js'

// One icon per badge id (ids come from BADGES in src/lib/profileLists.js).
export const ICONS = {
  'first-steps': FootprintsIcon,
  'block-walker': PinStreetIcon,
  voice: SpeechHouseIcon,
  liked: HeartIcon,
  photographer: CameraIcon,
  elite: WaveStarIcon,
}

// Each badge has its own color. Surfer Elite is gold on black whatever the theme.
export const TONES = { 'first-steps': 'green', 'block-walker': 'blue', voice: 'purple', liked: 'coral', photographer: 'amber', elite: 'elite' }

// The small badge next to a handle: a 24 px colored circle with the badge icon, or for Surfer
// Elite a small black pill that says ELITE with a gold edge. The name is for screen readers.
export function BadgeMark({ id }) {
  const badge = BADGES.find((b) => b.id === id)
  if (!badge) return null
  if (id === 'elite') {
    return (
      <span className="bmark bmark-pill" role="img" aria-label={`${badge.name} badge`}>
        ELITE
      </span>
    )
  }
  const Icon = ICONS[id]
  return (
    <span className={`bmark bmark-${TONES[id]}`} role="img" aria-label={`${badge.name} badge`}>
      <Icon />
    </span>
  )
}
