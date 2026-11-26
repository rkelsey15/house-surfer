import { useEffect, useId, useRef, useState } from 'react'
import { useProfile } from '../lib/ProfileContext.jsx'
import { buildSurferCard, sampleCard } from '../lib/surfers.js'
import { useMediaQuery } from '../lib/useMediaQuery.js'
import { useMyBadges } from '../lib/useMyBadges.js'
import { BadgeMark } from './badgeArt.jsx'
import { CloseIcon } from './Icons.jsx'

const monthYear = (iso) => new Date(iso).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })

// A commenter's handle, with their featured badge next to it. Tap the handle to open the
// surfer card: a popover on laptops, a bottom sheet on phones. The card only ever shows what
// buildSurferCard returns (no karma, no locked badges, no progress, no activity).
export default function SurferHandle({ handle, sample = false }) {
  const { profile } = useProfile()
  const mine = useMyBadges()
  const isMe = !sample && profile?.handle === handle
  const card = isMe
    ? buildSurferCard({ handle, since: profile.joined, rated: mine.ratingCount, comments: mine.commentCount, earnedIds: mine.earnedIds, saved: mine.saved })
    : sample
      ? sampleCard(handle)
      : buildSurferCard({ handle })
  const [open, setOpen] = useState(false)
  const btnRef = useRef(null)
  const cardRef = useRef(null)
  const wide = useMediaQuery('(min-width: 900px)')
  const titleId = useId()

  const close = () => {
    setOpen(false)
    btnRef.current?.focus()
  }

  // Esc closes; a tap outside closes (the sheet has its own backdrop); Tab stays inside the sheet.
  useEffect(() => {
    if (!open) return undefined
    cardRef.current?.focus()
    const onKey = (e) => {
      if (e.key === 'Escape') close()
      if (e.key === 'Tab' && !wide && cardRef.current) {
        const items = [...cardRef.current.querySelectorAll('button')]
        if (!items.length) return
        const first = items[0]
        const last = items[items.length - 1]
        if (e.shiftKey && (document.activeElement === first || document.activeElement === cardRef.current)) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    const onDown = (e) => {
      if (cardRef.current?.contains(e.target) || btnRef.current?.contains(e.target)) return
      close()
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('click', onDown)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('click', onDown)
    }
  }, [open, wide])

  return (
    <span className="surfer-wrap">
      <button
        ref={btnRef}
        className="surfer-btn"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={`${handle}, surfer card`}
        onClick={() => setOpen((o) => !o)}
      >
        {handle}
      </button>
      {card.featured && <BadgeMark id={card.featured} />}
      {open && (
        <>
          {!wide && <span className="sheet-backdrop" aria-hidden="true" />}
          <div
            ref={cardRef}
            className={wide ? 'surfer-card surfer-pop' : 'surfer-card surfer-sheet'}
            role="dialog"
            aria-modal={!wide}
            aria-labelledby={titleId}
            tabIndex={-1}
          >
            <div className="surfer-head">
              <h3 id={titleId}>{handle}</h3>
              {card.featured && <BadgeMark id={card.featured} />}
              {card.sample && <span className="surfer-sample">Sample surfer</span>}
            </div>
            {card.since ? (
              <>
                <p className="muted small">Surfing since {monthYear(card.since)}</p>
                <dl className="surfer-stats">
                  <div><dt>Homes rated</dt><dd>{card.rated}</dd></div>
                  <div><dt>Comments</dt><dd>{card.comments}</dd></div>
                </dl>
              </>
            ) : (
              <p className="muted small">No profile details in the demo.</p>
            )}
            <h4>Badges</h4>
            {card.badges.length === 0 ? (
              <p className="muted small">No badges earned yet.</p>
            ) : (
              <ul className="surfer-badges">
                {card.badges.map((b) => (
                  <li key={b.id}>
                    <BadgeMark id={b.id} />
                    <span>
                      <b>{b.name}</b>
                      <span className="muted small">{b.how}</span>
                    </span>
                  </li>
                ))}
              </ul>
            )}
            <button className="btn full" onClick={close}>Close</button>
          </div>
        </>
      )}
    </span>
  )
}
