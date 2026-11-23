// Pure helpers for the Profile screen: my comments, recent activity, locked badges.

// My live (not deleted) comments, newest first.
export const myComments = (comments, me) =>
  comments.filter((c) => c.user === me && !c.deleted_at).sort((a, b) => b.created_at.localeCompare(a.created_at))

// "just now", "2 min ago", "3 hr ago", "yesterday", "5 days ago", then a date.
export function relativeTime(iso, nowMs = Date.now()) {
  const secs = Math.max(0, Math.round((nowMs - new Date(iso).getTime()) / 1000))
  if (secs < 60) return 'just now'
  const mins = Math.floor(secs / 60)
  if (mins < 60) return `${mins} min ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs} hr ago`
  const days = Math.floor(hrs / 24)
  if (days === 1) return 'yesterday'
  if (days < 7) return `${days} days ago`
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

// My last actions (ratings, comments, likes, snaps), newest first.
// Each: { key, kind: 'rated'|'commented'|'liked'|'snapped', home_id, at, stars? }.
// Built from the saved data itself, so it always matches what the app holds.
export function recentActivity({ ratings, comments, likes, photos, me, limit = 10 }) {
  const items = []
  for (const [home_id, r] of Object.entries(ratings)) {
    items.push({ key: `r-${home_id}`, kind: 'rated', home_id, at: r.at, stars: r.stars })
  }
  const byId = new Map(comments.map((c) => [c.id, c]))
  for (const c of comments) {
    if (c.user === me && !c.deleted_at) items.push({ key: `c-${c.id}`, kind: 'commented', home_id: c.home_id, at: c.created_at })
  }
  for (const l of likes) {
    const target = byId.get(l.comment_id)
    if (l.user === me && target) items.push({ key: `l-${l.comment_id}`, kind: 'liked', home_id: target.home_id, at: l.created_at })
  }
  for (const p of photos) items.push({ key: `p-${p.id}`, kind: 'snapped', home_id: p.home_id, at: p.created_at })
  return items.filter((i) => i.at).sort((a, b) => b.at.localeCompare(a.at)).slice(0, limit)
}

// Locked badge placeholders. Nothing unlocks in the demo.
export const LOCKED_BADGES = [
  { id: 'first-steps', name: 'First Steps', how: 'Rate 5 homes' },
  { id: 'block-walker', name: 'Block Walker', how: 'Rate 25 homes' },
  { id: 'voice', name: 'Good Neighbor Voice', how: 'Post 10 comments' },
  { id: 'liked', name: 'Crowd Favorite', how: 'Get 25 likes on your comments' },
  { id: 'photographer', name: 'Curb Photographer', how: 'Snap 5 houses' },
]
