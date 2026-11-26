import { useId, useState } from 'react'
import { CheckIcon, LockIcon } from './Icons.jsx'
import { ICONS, TONES } from './badgeArt.jsx'

// A badge tile. Tap it to read how to earn it. `earned` shows it in full color with no lock.
// While choosing the featured badge (`selecting`), tapping an earned badge features it instead
// (it is a toggle button with aria-pressed). Locked badges can't be featured.
export default function Badge({ badge, earned = false, featured = false, selecting = false, onSelect }) {
  const [open, setOpen] = useState(false)
  const detailId = useId()
  const Icon = ICONS[badge.id]
  const tone = TONES[badge.id]
  const pick = selecting && earned
  return (
    <li className="badge-item">
      <button
        className={`badge badge-${tone}${earned ? '' : ' is-locked'}${featured ? ' is-featured' : ''}`}
        {...(pick ? { 'aria-pressed': featured } : { 'aria-expanded': open, 'aria-controls': detailId })}
        onClick={() => (pick ? onSelect(badge.id) : setOpen((o) => !o))}
      >
        <span className="badge-medal" aria-hidden="true">
          <Icon />
          {!earned && (
            <span className="badge-lockmark">
              <LockIcon />
            </span>
          )}
        </span>
        {featured && (
          <span className="badge-feat" aria-hidden="true">
            <CheckIcon />
          </span>
        )}
        <span className="sr-only">{`${earned ? 'Earned' : 'Locked'}${featured ? ', featured' : ''}: `}</span>
        <b>{badge.name}</b>
        <span className="badge-how">{!earned && badge.needsOthers ? 'Needs other surfers (V2)' : badge.how}</span>
      </button>
      <p className="badge-detail" id={detailId} hidden={pick || !open}>
        <b>{earned ? 'How you earned it:' : 'How to earn it:'}</b> {badge.detail}
      </p>
    </li>
  )
}
