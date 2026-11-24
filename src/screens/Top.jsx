import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import HomeCover from '../components/HomeCover.jsx'
import { EmptyState } from '../components/MoodImage.jsx'
import { MOOD_PHOTOS } from '../lib/credits.js'
import { useHomes } from '../lib/HomesContext.jsx'
import { factsLine, ratingText, typeLine } from '../lib/format.js'
import { useHomeStats } from '../lib/homeStats.js'
import { CROWN, FLAME } from '../lib/badges.js'
import { homeOfTheWeek, hotThisWeek, topRated } from '../lib/top.js'

const TOP_PAGE = 10
const HOT_LIMIT = 5

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

// Small flame or crown icon next to a heading (the same drawings as the map badges).
const Icon = ({ svg }) => <i className="legend-badge top-icon" aria-hidden="true" dangerouslySetInnerHTML={{ __html: svg }} />

// The one crowned home, shown big at the top.
function WeekCard({ row }) {
  return (
    <section className="top-section">
      <h2 className="sec-t"><Icon svg={CROWN} />Home of the week</h2>
      {row ? (
        <Link to={'/home/' + row.home.id} state={{ source: 'top' }} className="weekcard">
          <HomeCover home={row.home} height={210} />
          <span className="weekcard-text">
            <span className="addr">{row.home.address}</span>
            <span className="facts">{typeLine(row.home)}</span>
            <span className="facts">{factsLine(row.home)}</span>
            <span className="top-score">{ratingText(row.stat)}</span>
          </span>
        </Link>
      ) : (
        <p className="muted center note">No home of the week yet. It goes to the hot home with the best rating.</p>
      )}
    </section>
  )
}

function Section({ title, note, rows, empty, emptyTitle, ranked, photo }) {
  const [shown, setShown] = useState(TOP_PAGE)
  return (
    <section className="top-section">
      <h2 className="sec-t">{title}</h2>
      {note && <p className="muted small">{note}</p>}
      {rows.length === 0 ? (
        photo ? (
          <EmptyState photo={photo} position="50% 60%" title={emptyTitle}>
            <p className="muted">{empty}</p>
          </EmptyState>
        ) : (
          <p className="muted center note">{empty}</p>
        )
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
  const hot = useMemo(() => hotThisWeek(homes, stats).slice(0, HOT_LIMIT), [homes, stats])
  const week = useMemo(() => homeOfTheWeek(homes, stats), [homes, stats])

  if (status === 'loading') return <p className="muted center">Loading homes…</p>
  if (status === 'error') return <p className="blocked">Could not load homes: {error}</p>

  return (
    <div className="top-screen">
      <h1>Top homes</h1>
      <WeekCard row={week} />
      <div className="top-cols">
        <Section
          title={<><Icon svg={FLAME} />Hot this week</>}
          note="The 5 homes with the most ratings and comments in the last 7 days."
          rows={hot}
          empty="Nothing is hot yet. Rate or comment on a few homes."
        />
        <Section
          title="Top rated"
          note="4.5 stars or more, from at least 3 ratings."
          rows={top}
          ranked
          emptyTitle="No top homes yet"
          empty="Rate a few homes to see the top list."
          photo={MOOD_PHOTOS.street}
        />
      </div>
    </div>
  )
}
