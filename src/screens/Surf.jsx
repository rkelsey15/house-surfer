import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import HouseArt from '../components/HouseArt.jsx'
import StarRating from '../components/StarRating.jsx'
import { useHomes } from '../lib/HomesContext.jsx'
import { useRatings } from '../lib/RatingsContext.jsx'
import { factsLine, typeLine } from '../lib/format.js'

// Shuffle once per visit so the feed order is random but stable while you
// surf. Homes you've already rated are left out of the queue.
function buildQueue(homes, rated) {
  const list = homes.filter((h) => !rated[h.id])
  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[list[i], list[j]] = [list[j], list[i]]
  }
  return list
}

// Remembered while the app is open, so coming back from a home page (Back)
// keeps your place in the feed instead of reshuffling it.
const session = { homes: null, queue: [], pos: 0 }

export default function Surf() {
  const { homes, status, error } = useHomes()
  const { ratings, rate, count } = useRatings()
  const navigate = useNavigate()
  const [pos, setPosState] = useState(() => session.pos)
  const setPos = (n) => {
    session.pos = typeof n === 'function' ? n(session.pos) : n
    setPosState(session.pos)
  }

  // Built once when homes load. Rating a home must not reshuffle the queue,
  // so `ratings` is read here on purpose without being a dependency.
  const queue = useMemo(() => {
    if (session.homes !== homes) Object.assign(session, { homes, queue: buildQueue(homes, ratings), pos: 0 })
    return session.queue
  }, [homes]) // eslint-disable-line react-hooks/exhaustive-deps

  if (status === 'loading') return <p className="muted center">Loading homes…</p>
  if (status === 'error') return <p className="blocked">Could not load homes: {error}</p>

  const home = queue[pos]
  if (!home) {
    return (
      <div className="coming">
        <h2>You've surfed them all</h2>
        <p className="muted">That's every home in the feed. Rate more from the map once it arrives.</p>
        <button className="btn" onClick={() => setPos(0)}>Start over</button>
      </div>
    )
  }

  const mine = ratings[home.id]?.stars ?? 0
  const next = () => setPos((p) => p + 1)

  return (
    <div>
      <div className="card" key={home.id}>
        <HouseArt home={home} />
        <div className="info">
          <div className="addr">{home.address}</div>
          <div className="facts">{typeLine(home)}</div>
          <div className="facts">{factsLine(home)}</div>
        </div>
      </div>

      <p className="rate-label">{mine ? `You gave it ${mine} star${mine > 1 ? 's' : ''}` : 'What do you think of this house?'}</p>
      <StarRating value={mine} onChange={(n) => rate(home.id, n)} />

      <div className="feed-actions">
        <button className="btn" onClick={next}>Skip</button>
        <button className="btn" onClick={() => navigate('/home/' + home.id)}>Comments</button>
        <button className="btn pri" onClick={next} disabled={!mine}>Next</button>
      </div>
      <p className="muted center note">{count} home{count === 1 ? '' : 's'} rated so far</p>
    </div>
  )
}
