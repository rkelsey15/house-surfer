import { useMemo } from 'react'
import { useComments } from './CommentsContext.jsx'
import { useRatings } from './RatingsContext.jsx'
import { sampleComments, sampleRating } from './sampleData.js'

// Average rating and "hot this week" for every home, used by the map and list.
// Same sources as the home page: made-up sample ratings plus your own.
//
// Hot this week = 2 or more comments in the last 7 days. (Single-player has
// only sample comments and yours; V2 will count real people's comments.)
export const HOT_DAYS = 7
export const HOT_MIN_COMMENTS = 2
export const TOP_RATED_MIN = 4

const WEEK_MS = HOT_DAYS * 86400000

// Sample part: depends only on the homes, so it is built once.
function useSampleStats(homes) {
  return useMemo(() => {
    const cutoff = Date.now() - WEEK_MS
    const map = new Map()
    for (const h of homes) {
      const { count, sum } = sampleRating(h.id)
      const recent = sampleComments(h.id).filter((c) => new Date(c.created_at).getTime() >= cutoff).length
      map.set(h.id, { count, sum, recent })
    }
    return map
  }, [homes])
}

// Returns a Map: homeId -> { avg (number or null), count, hot }
export function useHomeStats(homes) {
  const sample = useSampleStats(homes)
  const { ratings } = useRatings()
  const { comments } = useComments()

  return useMemo(() => {
    const cutoff = Date.now() - WEEK_MS
    const recentReal = new Map()
    for (const c of comments) {
      if (c.deleted_at || new Date(c.created_at).getTime() < cutoff) continue
      recentReal.set(c.home_id, (recentReal.get(c.home_id) ?? 0) + 1)
    }
    const out = new Map()
    for (const h of homes) {
      const s = sample.get(h.id)
      const mine = ratings[h.id]?.stars ?? 0
      const count = s.count + (mine ? 1 : 0)
      const avg = count ? (s.sum + mine) / count : null
      const hot = s.recent + (recentReal.get(h.id) ?? 0) >= HOT_MIN_COMMENTS
      out.set(h.id, { avg, count, hot })
    }
    return out
  }, [homes, sample, ratings, comments])
}

// Pin color group for a home: hot beats 4+, which beats rated, which beats unrated.
export function pinKind(stat) {
  if (stat.hot) return 'hot'
  if (stat.avg === null) return 'unrated'
  return stat.avg >= TOP_RATED_MIN ? 'top' : 'rated'
}
