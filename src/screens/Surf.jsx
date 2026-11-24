import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import HomeCover from '../components/HomeCover.jsx'
import { EmptyState } from '../components/MoodImage.jsx'
import TryThisGuide from '../components/TryThisGuide.jsx'
import StarRating from '../components/StarRating.jsx'
import { useGuide } from '../lib/GuideContext.jsx'
import { useHomes } from '../lib/HomesContext.jsx'
import { useRatings } from '../lib/RatingsContext.jsx'
import { MOOD_PHOTOS } from '../lib/credits.js'
import { factsLine, typeLine } from '../lib/format.js'
import { feed, getQueue, setPos as setFeedPos } from '../lib/feedSession.js'
import { LAPTOP_QUERY, useMediaQuery } from '../lib/useMediaQuery.js'

export default function Surf() {
  const { homes, status, error } = useHomes()
  const { ratings, rate, count } = useRatings()
  const { dismissed } = useGuide()
  const navigate = useNavigate()
  const laptop = useMediaQuery(LAPTOP_QUERY)
  const [pos, setPosState] = useState(() => feed.pos)
  const setPos = (n) => setPosState(setFeedPos(n))

  // Built once when homes load (shared with the home page's "Next house").
  const queue = useMemo(() => getQueue(homes, ratings), [homes]) // eslint-disable-line react-hooks/exhaustive-deps

  if (status === 'loading') return <p className="muted center">Loading homes…</p>
  if (status === 'error') return <p className="blocked">Could not load homes: {error}</p>

  const home = queue[pos]
  if (!home) {
    return (
      <div className="surf-done">
        <h1 className="sr-only">Surf</h1>
        <EmptyState photo={MOOD_PHOTOS.street} position="50% 55%" title="You've surfed them all">
          <p className="muted">That's every home in the feed. Rate more from the map, or start the feed again.</p>
          <button className="btn pri" onClick={() => setPos(0)}>Start over</button>
        </EmptyState>
      </div>
    )
  }

  const mine = ratings[home.id]?.stars ?? 0
  const next = () => setPos((p) => p + 1)

  // Phones: the Try this card sits above the house. Laptops: it is a panel on the right.
  return (
    <div className={laptop ? (dismissed ? 'surf-grid no-guide' : 'surf-grid') : 'surf'}>
      <h1 className="sr-only">Surf</h1>
      {!laptop && <TryThisGuide />}
      <div className="surf-card-col">
        <div className="card" key={home.id}>
          <HomeCover home={home} height={laptop ? 400 : 210} />
          <div className="info">
            <h2 className="addr">{home.address}</h2>
            <div className="facts">{typeLine(home)}</div>
            <div className="facts">{factsLine(home)}</div>
          </div>
        </div>

        <p className="rate-label">{mine ? `You gave it ${mine} star${mine > 1 ? 's' : ''}` : 'What do you think of this house?'}</p>
        <StarRating value={mine} onChange={(n) => rate(home.id, n)} />

        <div className="feed-actions">
          <button className="btn" onClick={next}>Skip</button>
          <button className="btn" onClick={() => navigate('/home/' + home.id, { state: { source: 'feed' } })}>Comments</button>
          <button className="btn pri" onClick={next} disabled={!mine}>Next</button>
        </div>
        <p className="muted center note">{count} home{count === 1 ? '' : 's'} rated so far</p>
      </div>
      {laptop && <TryThisGuide panel />}
    </div>
  )
}
