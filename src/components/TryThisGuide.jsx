import { useState } from 'react'
import { Link } from 'react-router-dom'
import { GUIDE_ITEMS, useGuide } from '../lib/GuideContext.jsx'
import { useRatings } from '../lib/RatingsContext.jsx'
import { CheckIcon, ChevronDownIcon, CloseIcon } from './Icons.jsx'

// First-visit checklist for the Surf screen.
//  - Phones: a small card above the house that starts collapsed ("Try this  1 of 4").
//  - Laptops (`panel`): a panel on the right of the house card, always open.
export default function TryThisGuide({ panel = false }) {
  const { dismissed, done, doneCount, total, dismiss } = useGuide()
  const { count } = useRatings()
  const [openState, setOpen] = useState(() => window.matchMedia('(min-width: 600px)').matches)
  if (dismissed) return null

  const open = panel || openState
  const allDone = doneCount === total

  return (
    <section className={panel ? 'guide guide-panel' : 'guide'} aria-label="Try this">
      <div className="guide-head">
        {panel ? (
          <h2 className="guide-title">
            Try this <span className="muted small">{doneCount} of {total}</span>
          </h2>
        ) : (
          <button className="guide-toggle" aria-expanded={openState} onClick={() => setOpen((o) => !o)}>
            <b>Try this</b>
            <span className="muted small">{doneCount} of {total}</span>
            <span className={openState ? 'chev open' : 'chev'} aria-hidden="true"><ChevronDownIcon /></span>
          </button>
        )}
        <button className="icon-btn" aria-label="Dismiss Try this guide" onClick={dismiss}>
          <CloseIcon />
        </button>
      </div>
      {open && (
        <>
          {panel && <p className="muted small guide-intro">Four things to do in about a minute.</p>}
          {allDone && (
            <p className="guide-done">
              You've seen it all.{' '}
              <button className="btn quiet" onClick={dismiss}>Dismiss</button>
            </p>
          )}
          <ul className="guide-list">
            {GUIDE_ITEMS.map((item) => (
              <li key={item.key} className={done[item.key] ? 'done' : ''}>
                <span className="guide-check" aria-hidden="true">{done[item.key] ? <CheckIcon /> : null}</span>
                <span>
                  {item.key === 'map' ? <Link to="/map">{item.label}</Link> : item.label}
                  {item.key === 'rate3' && !done.rate3 && <span className="muted"> ({Math.min(count, 3)}/3)</span>}
                  {item.hint && !done[item.key] && <span className="guide-hint">{item.hint}</span>}
                  {done[item.key] && <span className="sr-only"> (done)</span>}
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  )
}
