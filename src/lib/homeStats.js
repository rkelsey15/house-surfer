import { useMemo } from 'react'
import { useComments } from './CommentsContext.jsx'
import { useRatings } from './RatingsContext.jsx'
import { GOLD_MIN, GOLD_MIN_RATINGS, GREEN_MIN, HOT_DAYS, HOT_MIN_ACTIVITY } from './rules.js'
import { sampleRating, sampleRecentRatings } from './sampleData.js'

// Average rating, "hot this week" and "top of the week" for every home, used
// by the map and list. Same sources as the home page: made-up sample ratings
// plus your own.
//
// Pin colors (by average):
//   unrated gray | under 3.5 slate blue | 3.5 to 4.4 green
//   4.5+ with at least 3 ratings: gold
// Hot = 2 or more comments or ratings in the last 7 days (flame badge).
// Top of the week = the one hot home with the best average (3+ ratings): purple + crown.

const WEEK_MS = HOT_DAYS * 86400000

// Sample part: depends only on the homes, so it is built once.
function useSampleStats(homes) {
  return useMemo(() => {
    // Only made-up recent ratings count as sample activity. (The sample
    // comments' dates are made up relative to today, and counting them would
    // make about 1 in 5 homes "hot".)
    const map = new Map()
    for (const h of homes) {
      const { count, sum } = sampleRating(h.id)
      map.set(h.id, { count, sum, recent: sampleRecentRatings(h.id) })
    }
    return map
  }, [homes])
}

// Returns a Map: homeId -> { avg (number or null), count, hot, activity, week }
// activity = ratings and comments in the last 7 days.
export function useHomeStats(homes) {
  const sample = useSampleStats(homes)
  const { ratings } = useRatings()
  const { comments } = useComments()

  return useMemo(() => {
    const cutoff = Date.now() - WEEK_MS
    const recentReal = new Map()
    const bump = (id) => recentReal.set(id, (recentReal.get(id) ?? 0) + 1)
    for (const c of comments) {
      if (!c.deleted_at && new Date(c.created_at).getTime() >= cutoff) bump(c.home_id)
    }
    for (const [id, r] of Object.entries(ratings)) {
      if (new Date(r.at).getTime() >= cutoff) bump(id)
    }
    const out = new Map()
    let best = null
    for (const h of homes) {
      const s = sample.get(h.id)
      const mine = ratings[h.id]?.stars ?? 0
      const count = s.count + (mine ? 1 : 0)
      const avg = count ? (s.sum + mine) / count : null
      const activity = s.recent + (recentReal.get(h.id) ?? 0)
      const hot = activity >= HOT_MIN_ACTIVITY
      const stat = { avg, count, hot, activity, week: false }
      out.set(h.id, stat)
      if (hot && count >= GOLD_MIN_RATINGS) {
        if (!best || avg > best.avg || (avg === best.avg && count > best.count)) best = { ...stat, id: h.id }
      }
    }
    if (best) out.get(best.id).week = true
    return out
  }, [homes, sample, ratings, comments])
}

// Pin color group: week (purple), high (gold), mid (green), low (slate blue), unrated (gray).
export function pinKind(stat) {
  if (stat.week) return 'week'
  if (stat.avg === null) return 'unrated'
  if (stat.avg >= GOLD_MIN && stat.count >= GOLD_MIN_RATINGS) return 'high'
  if (stat.avg >= GREEN_MIN) return 'mid'
  return 'low'
}
