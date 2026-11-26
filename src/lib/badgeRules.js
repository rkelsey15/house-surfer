// Which badges the visitor has earned, worked out from data already on this device
// (ratings, comments, Snap photos). Nothing extra is saved: change the data and the badge follows.
// Crowd Favorite and Surfer Elite need other people's likes, so they stay locked until V2.

// Rate 5 homes, rate 25 homes, post 10 comments, snap 5 different houses.
export const BADGE_RULES = {
  'first-steps': { ratings: 5 },
  'block-walker': { ratings: 25 },
  voice: { comments: 10 },
  photographer: { homes: 5 },
}

// Badges that cannot be earned in the demo (V2: needs other surfers).
export const NEEDS_OTHERS = ['liked', 'elite']

// Number of different homes the visitor has snapped (two photos of one house count once).
export const snappedHomeCount = (photos) => new Set(photos.map((p) => p.home_id)).size

// Ids of the earned badges, in badge order. `ratingCount`, `commentCount` (my live comments and
// replies) and `snappedHomes` are plain numbers.
export function earnedBadgeIds({ ratingCount = 0, commentCount = 0, snappedHomes = 0 }) {
  const out = []
  if (ratingCount >= BADGE_RULES['first-steps'].ratings) out.push('first-steps')
  if (ratingCount >= BADGE_RULES['block-walker'].ratings) out.push('block-walker')
  if (commentCount >= BADGE_RULES.voice.comments) out.push('voice')
  if (snappedHomes >= BADGE_RULES.photographer.homes) out.push('photographer')
  return out
}
