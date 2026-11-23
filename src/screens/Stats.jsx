import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { readEvents } from '../lib/events.js'
import { dailyCounts, isSingleVisitor, northStar } from '../lib/stats.js'

const shortDay = (key) => {
  const [, m, d] = key.split('-')
  return `${Number(m)}/${Number(d)}`
}

// Product numbers from the event log saved on this device (PRD Metrics).
export default function Stats() {
  const events = useMemo(() => readEvents(), [])
  const daily = useMemo(() => dailyCounts(events), [events])
  const weeks = useMemo(() => northStar(events), [events])

  return (
    <div className="stats-screen">
      <h1>Stats</h1>
      {isSingleVisitor(events) && <p className="demo-data">Demo data: one visitor, this device only</p>}

      <h2 className="sec-t">North star: ratings per active user, per week</h2>
      <p className="muted small">A week is 7 days counted back from now. An active user is a handle with any event that week.</p>
      <div className="ns-grid">
        {weeks.map((w, i) => (
          <div key={w.label} className={i === 0 ? 'ns on' : 'ns'}>
            <b>{w.perUser.toFixed(1)}</b>
            <span>{w.label}</span>
            <span className="muted">{w.ratings} ratings · {w.active} active</span>
          </div>
        ))}
      </div>

      <h2 className="sec-t">Events, last 14 days</h2>
      {events.length === 0 ? (
        <p className="muted center note">No events yet. Rate a home, then come back.</p>
      ) : (
        <div className="daily-list">
          {daily.rows.map((r) => (
            <details key={r.name} className="daily">
              <summary>
                <span>{r.name}</span>
                <b>{r.total}</b>
              </summary>
              <ul>
                {daily.days.map((d, i) => (
                  <li key={d}>
                    <span>{shortDay(d)}</span>
                    <b>{r.counts[i]}</b>
                  </li>
                ))}
              </ul>
            </details>
          ))}
        </div>
      )}
      <p className="muted small"><Link to="/profile">Back to Profile</Link></p>
    </div>
  )
}
