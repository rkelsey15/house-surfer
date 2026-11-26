import { useEffect, useMemo, useState } from 'react'
import { BADGES } from '../lib/profileLists.js'
import { earnedBadgeIds, snappedHomeCount } from '../lib/badgeRules.js'
import { logEvent, readEvents } from '../lib/events.js'
import { useComments } from '../lib/CommentsContext.jsx'
import { usePhotos } from '../lib/PhotosContext.jsx'
import { useProfile } from '../lib/ProfileContext.jsx'
import { useRatings } from '../lib/RatingsContext.jsx'
import { CloseIcon } from './Icons.jsx'

// "Badge earned: <name>" the first time a badge unlocks. Which badges are earned is worked out
// from ratings, comments and Snap photos. "First time" comes from the event log: a badge with no
// `badge_earned` event for this handle is new, so we log it and show the toast. (No new storage.)
// The live region is always on the page so screen readers announce the text when it appears.
export default function BadgeToast() {
  const { profile } = useProfile()
  const { count: ratingCount } = useRatings()
  const { count: commentCount } = useComments()
  const { photos } = usePhotos()
  const [queue, setQueue] = useState([])
  const snappedHomes = snappedHomeCount(photos)

  const earned = useMemo(() => earnedBadgeIds({ ratingCount, commentCount, snappedHomes }), [ratingCount, commentCount, snappedHomes])

  useEffect(() => {
    if (!profile) return
    const seen = new Set(readEvents().filter((e) => e.name === 'badge_earned' && e.handle === profile.handle).map((e) => e.badge))
    const fresh = BADGES.filter((b) => earned.includes(b.id) && !seen.has(b.name))
    if (!fresh.length) return
    for (const b of fresh) logEvent('badge_earned', { badge: b.name })
    setQueue((q) => [...q, ...fresh.map((b) => b.name)])
  }, [earned, profile])

  // Show one at a time; each goes away on its own after 6 seconds, or when closed.
  const current = queue[0]
  useEffect(() => {
    if (!current) return undefined
    const t = setTimeout(() => setQueue((q) => q.slice(1)), 6000)
    return () => clearTimeout(t)
  }, [current])

  return (
    <div className="toast-region" role="status" aria-live="polite">
      {current && (
        <div className="toast">
          <span>Badge earned: <b>{current}</b></span>
          <button className="icon-btn" aria-label="Dismiss" onClick={() => setQueue((q) => q.slice(1))}>
            <CloseIcon />
          </button>
        </div>
      )}
    </div>
  )
}
