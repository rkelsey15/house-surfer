// Numbers for the /stats page. Pure functions over the event log.

export const EVENT_NAMES = [
  'app_opened', 'home_viewed', 'rating_submitted', 'comment_posted', 'comment_edited',
  'comment_deleted', 'like_given', 'photo_uploaded', 'comment_blocked', 'theme_changed',
]

const DAY = 86400000
const dayKey = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

// Counts per event for each of the last `days` days (local time), oldest first.
// Returns { days: ['2026-11-09', ...], rows: [{ name, counts: [..], total }] }.
export function dailyCounts(events, now = Date.now(), days = 14) {
  const keys = []
  for (let i = days - 1; i >= 0; i--) keys.push(dayKey(new Date(now - i * DAY)))
  const index = new Map(keys.map((k, i) => [k, i]))
  const rows = EVENT_NAMES.map((name) => ({ name, counts: Array(days).fill(0), total: 0 }))
  const byName = new Map(rows.map((r) => [r.name, r]))
  for (const e of events) {
    const row = byName.get(e.name)
    const i = index.get(dayKey(new Date(e.at)))
    if (row && i !== undefined) {
      row.counts[i]++
      row.total++
    }
  }
  return { days: keys, rows }
}

// North-star: ratings per active user per week. A "week" is 7 days counted back
// from now (first row = the last 7 days). An active user is a handle with any
// event that week. Returns newest week first: [{ label, ratings, active, perUser }].
export function northStar(events, now = Date.now(), weeks = 4) {
  const out = []
  for (let w = 0; w < weeks; w++) {
    const end = now - w * 7 * DAY
    const start = end - 7 * DAY
    const inWeek = events.filter((e) => {
      const t = new Date(e.at).getTime()
      return t > start && t <= end
    })
    const active = new Set(inWeek.map((e) => e.handle).filter(Boolean)).size
    const ratings = inWeek.filter((e) => e.name === 'rating_submitted').length
    out.push({
      label: w === 0 ? 'This week' : w === 1 ? 'Last week' : `${w} weeks ago`,
      ratings,
      active,
      perUser: active ? ratings / active : 0,
    })
  }
  return out
}

// True when every logged event came from one handle (always the case in the demo).
export const isSingleVisitor = (events) => new Set(events.map((e) => e.handle).filter(Boolean)).size <= 1
