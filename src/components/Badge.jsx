import { useId, useState } from 'react'
import { CameraIcon, FootprintsIcon, HeartIcon, LockIcon, PinStreetIcon, SpeechHouseIcon, WaveStarIcon } from './Icons.jsx'

// One icon per badge id (ids come from BADGES in src/lib/profileLists.js).
const ICONS = {
  'first-steps': FootprintsIcon,
  'block-walker': PinStreetIcon,
  voice: SpeechHouseIcon,
  liked: HeartIcon,
  photographer: CameraIcon,
  elite: WaveStarIcon,
}

// Each badge has its own color, earned or locked. Locked is the same color, softer, with a
// small lock. Surfer Elite is gold on black whatever the theme.
const TONES = { 'first-steps': 'green', 'block-walker': 'blue', voice: 'purple', liked: 'coral', photographer: 'amber', elite: 'elite' }

// A badge tile. Tap it to read how to earn it. `earned` shows it in full color with no lock.
export default function Badge({ badge, earned = false }) {
  const [open, setOpen] = useState(false)
  const detailId = useId()
  const Icon = ICONS[badge.id]
  const tone = TONES[badge.id]
  return (
    <li className="badge-item">
      <button className={`badge badge-${tone}${earned ? '' : ' is-locked'}`} aria-expanded={open} aria-controls={detailId} onClick={() => setOpen((o) => !o)}>
        <span className="badge-medal" aria-hidden="true">
          <Icon />
          {!earned && (
            <span className="badge-lockmark">
              <LockIcon />
            </span>
          )}
        </span>
        <span className="sr-only">{earned ? 'Earned: ' : 'Locked: '}</span>
        <b>{badge.name}</b>
        <span className="badge-how">{!earned && badge.needsOthers ? 'Needs other surfers (V2)' : badge.how}</span>
      </button>
      <p className="badge-detail" id={detailId} hidden={!open}>
        <b>{earned ? 'How you earned it:' : 'How to earn it:'}</b> {badge.detail}
      </p>
    </li>
  )
}
