import { GOLD_MIN, GOLD_MIN_RATINGS } from './rules.js'

// The lists on the Top screen. Pure functions over the same stats the map uses,
// so the Top screen and the pins always agree.
//   stats: Map of homeId -> { avg, count, hot, activity, week }

const byAddress = (a, b) => a.home.address.localeCompare(b.home.address, 'en', { numeric: true })

// Top rated: the gold rule (4.5 or more with at least 3 ratings), best first.
export function topRated(homes, stats) {
  return rows(homes, stats)
    .filter(({ stat }) => stat.avg !== null && stat.avg >= GOLD_MIN && stat.count >= GOLD_MIN_RATINGS)
    .sort((a, b) => b.stat.avg - a.stat.avg || b.stat.count - a.stat.count || byAddress(a, b))
}

// Hot this week: the homes with the flame badge, most activity first.
export function hotThisWeek(homes, stats) {
  return rows(homes, stats)
    .filter(({ stat }) => stat.hot)
    .sort((a, b) => b.stat.activity - a.stat.activity || (b.stat.avg ?? 0) - (a.stat.avg ?? 0) || byAddress(a, b))
}

// Home of the week: the one home with the crown, or null.
export function homeOfTheWeek(homes, stats) {
  return rows(homes, stats).find(({ stat }) => stat.week) ?? null
}

function rows(homes, stats) {
  const out = []
  for (const home of homes) {
    const stat = stats.get(home.id)
    if (stat) out.push({ home, stat })
  }
  return out
}
