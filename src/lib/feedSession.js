// The Surf feed's queue and your place in it, kept while the app is open so the
// Surf screen and a home page opened from it share one "next house".
// Plain module state (no React), so it can be tested.

export const feed = { homes: null, queue: [], pos: 0 }

// Shuffle once per visit so the order is random but stable while you surf.
// Homes you've already rated are left out of the queue.
export function buildQueue(homes, rated, random = Math.random) {
  const list = homes.filter((h) => !rated[h.id])
  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    ;[list[i], list[j]] = [list[j], list[i]]
  }
  return list
}

// Built once when the homes load. Rating a home does not reshuffle the queue.
export function getQueue(homes, rated) {
  if (feed.homes !== homes) Object.assign(feed, { homes, queue: buildQueue(homes, rated), pos: 0 })
  return feed.queue
}

export function setPos(n) {
  feed.pos = typeof n === 'function' ? n(feed.pos) : n
  return feed.pos
}

// Move to the house after `currentId` in the feed and return it (or null at the end).
// If the current home isn't in the queue (for example the feed was rebuilt after a
// reload), carry on from your saved place.
export function advanceFeed(homes, rated, currentId) {
  const queue = getQueue(homes, rated)
  const at = queue.findIndex((h) => h.id === currentId)
  const nextPos = (at >= 0 ? at : feed.pos) + 1
  setPos(nextPos)
  return queue[nextPos] ?? null
}
