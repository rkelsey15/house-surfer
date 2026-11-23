import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import HomeCover from '../components/HomeCover.jsx'
import { useHomes } from '../lib/HomesContext.jsx'
import { factsLine, ratingText, typeLine } from '../lib/format.js'
import { useHomeStats } from '../lib/homeStats.js'
import { topRated } from '../lib/top.js'

const TOP_PAGE = 10

// One home in a list: picture, block address, facts and rating. Opens the home page.
function Row({ home, stat, rank }) {
  return (
    <Link to={'/home/' + home.id} state={{ source: 'top' }} className="toprow">
      {rank && <span className="toprank" aria-label={`Number ${rank}`}>{rank}</span>}
      <span className="toprow-art"><HomeCover home={home} height={64} /></span>
      <span className="toprow-text">
        <span className="addr">{home.address}</span>
        <span className="facts">{typeLine(home)}</span>
        <span className="facts">{factsLine(home)}</span>
        <span className="top-score">{ratingText(stat)}</span>
      </span>
    </Link>
  )
}

function Section({ title, note, rows, empty, ranked }) {
  const [shown, setShown] = useState(TOP_PAGE)
  return (
    <section className="top-section">
      <h2 className="sec-t">{title}</h2>
      {note && <p className="muted small">{note}</p>}
      {rows.length === 0 ? (
        <p className="muted center note">{empty}</p>
      ) : (
        <>
          {rows.slice(0, shown).map(({ home, stat }, i) => (
            <Row key={home.id} home={home} stat={stat} rank={ranked ? i + 1 : null} />
          ))}
          {rows.length > shown && (
            <button className="btn full" onClick={() => setShown((n) => n + TOP_PAGE)}>
              Show more ({rows.length - shown} more)
            </button>
          )}
        </>
      )}
    </section>
  )
}

export default function Top() {
  const { homes, status, error } = useHomes()
  const stats = useHomeStats(homes)
  const top = useMemo(() => topRated(homes, stats), [homes, stats])

  if (status === 'loading') return <p className="muted center">Loading homes…</p>
  if (status === 'error') return <p className="blocked">Could not load homes: {error}</p>

  return (
    <div className="top-screen">
      <h1>Top homes</h1>
      <Section
        title="Top rated"
        note="4.5 stars or more, from at least 3 ratings."
        rows={top}
        ranked
        empty="Rate a few homes to see the top list."
      />
    </div>
  )
}
