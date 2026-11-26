import { BADGES } from './profileLists.js'
import { earnedBadgeIds } from './badgeRules.js'
import { resolveFeatured } from './featured.js'

// The "surfer card" (tap a handle). It holds ONLY: handle, since, homes rated, comments and the
// earned badges. Never karma (private, shown only on your own Profile), locked badges, progress,
// recent activity, individual ratings or anything else. Keep it that way: tests check the keys.

// Made-up surfers behind the sample comments (see sampleData.js). Counts are made up; badges are
// worked out from them with the same rules as real ones. `extra` is for the two badges that need
// other surfers' likes (V2), which a sample surfer is pretended to have. The other sample
// commenters have no details and show only "Sample surfer".
export const SAMPLE_SURFERS = {
  GableGazer7: { since: '2026-03-04', rated: 31, comments: 6, snapped: 0, extra: ['liked'] },
  CedarSurfer12: { since: '2026-05-19', rated: 8, comments: 11, snapped: 0, extra: [] },
  PorchLightPete: { since: '2026-08-02', rated: 5, comments: 2, snapped: 0, extra: [] },
  TurretTom21: { since: '2026-02-11', rated: 6, comments: 28, snapped: 0, extra: ['elite'] },
}

// Badge ids a sample surfer has earned, in badge order.
export function sampleEarned(s) {
  const ids = new Set([...earnedBadgeIds({ ratingCount: s.rated, commentCount: s.comments, snappedHomes: s.snapped }), ...s.extra])
  return BADGES.filter((b) => ids.has(b.id)).map((b) => b.id)
}

// Build the card data. `since` is an ISO date or null. `earnedIds` are earned badges only.
// Anything not listed here is deliberately left out of the card.
export function buildSurferCard({ handle, since = null, rated = null, comments = null, earnedIds = [], saved = null, sample = false }) {
  return {
    handle,
    sample,
    since,
    rated,
    comments,
    badges: BADGES.filter((b) => earnedIds.includes(b.id)).map((b) => ({ id: b.id, name: b.name, how: b.how })),
    featured: resolveFeatured(saved, earnedIds),
  }
}

// Card for a sample commenter. Unknown sample handles get a bare "Sample surfer" card.
export function sampleCard(handle) {
  const s = SAMPLE_SURFERS[handle]
  if (!s) return buildSurferCard({ handle, sample: true })
  return buildSurferCard({ handle, since: s.since, rated: s.rated, comments: s.comments, earnedIds: sampleEarned(s), sample: true })
}
