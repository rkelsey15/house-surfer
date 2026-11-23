import { Link } from 'react-router-dom'
import { GUIDE_ITEMS, useGuide } from '../lib/GuideContext.jsx'
import { useRatings } from '../lib/RatingsContext.jsx'

// First-visit checklist shown at the top of the feed.
export default function TryThisGuide() {
  const { dismissed, done, doneCount, total, dismiss } = useGuide()
  const { count } = useRatings()
  if (dismissed) return null

  return (
    <section className="guide" aria-label="Try this">
      <div className="guide-head">
        <b>Try this</b>
        <span className="muted small">{doneCount} of {total}</span>
        <button className="guide-close" aria-label="Dismiss Try this guide" onClick={dismiss}>
          ×
        </button>
      </div>
      <ul className="guide-list">
        {GUIDE_ITEMS.map((item) => (
          <li key={item.key} className={done[item.key] ? 'done' : ''}>
            <span className="guide-check" aria-hidden="true">{done[item.key] ? '✓' : ''}</span>
            <span>
              {item.key === 'map' ? <Link to="/map">{item.label}</Link> : item.label}
              {item.key === 'rate3' && !done.rate3 && <span className="muted"> ({Math.min(count, 3)}/3)</span>}
              {item.hint && !done[item.key] && <span className="guide-hint">{item.hint}</span>}
              <span className="sr-only">{done[item.key] ? ' (done)' : ''}</span>
            </span>
          </li>
        ))}
      </ul>
      <span className="sr-only">{doneCount} of {total} done</span>
    </section>
  )
}
