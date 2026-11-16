// SAMPLE DATA. Everything in this file is made up so the app doesn't feel
// empty. It is not real feedback from real people. Sample comments and
// ratings are generated from the home id (the same home always gets the same
// ones), are never saved, and can't be edited or deleted.

const hash = (s) => {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619)
  return h >>> 0
}

// Handles are made up too. All comments are about the house itself.
const SAMPLE_THREADS = [
  {
    handle: 'GableGazer7', text: 'That roofline is doing all the heavy lifting and I respect it.', daysAgo: 2, likes: 14,
    replies: [{ handle: 'MossyRoof3', text: 'The front porch would be my whole personality.', daysAgo: 1, likes: 5 }],
  },
  { handle: 'CedarSurfer12', text: 'Love the color. Looks like it has been kept up beautifully.', daysAgo: 5, likes: 9, replies: [] },
  {
    handle: 'PorchLightPete', text: 'Great windows. I would sit in that front room all day.', daysAgo: 9, likes: 6,
    replies: [{ handle: 'BrickAndBay88', text: 'Agreed, the proportions are really nice.', daysAgo: 8, likes: 2 }],
  },
  { handle: 'TurretTom21', text: 'Classic Queen Anne look. The trim details stand out.', daysAgo: 12, likes: 11, replies: [] },
  { handle: 'FernGully4', text: 'Simple and clean. Would love to see it with a bit more garden.', daysAgo: 20, likes: 3, replies: [] },
]

// About half of homes get sample comments (1 or 2 threads).
export function sampleComments(homeId) {
  const h = hash(homeId)
  if (h % 2 === 1) return []
  const first = (h >>> 1) % SAMPLE_THREADS.length
  const picks = [first]
  if ((h >>> 5) % 3 === 0) picks.push((first + 2) % SAMPLE_THREADS.length)
  const out = []
  picks.forEach((p, i) => {
    const t = SAMPLE_THREADS[p]
    const id = `sample-${homeId}-${i}`
    out.push({ id, homeId, parentId: null, handle: t.handle, text: t.text, daysAgo: t.daysAgo, sampleLikes: t.likes, sample: true })
    t.replies.forEach((r, j) =>
      out.push({ id: `${id}-r${j}`, homeId, parentId: id, handle: r.handle, text: r.text, daysAgo: r.daysAgo, sampleLikes: r.likes, sample: true }),
    )
  })
  return out
}

// Sample star ratings so the average isn't just your own: a count and a sum
// that stay the same for a given home. Some homes have none.
export function sampleRating(homeId) {
  const h = hash(`r${homeId}`)
  if (h % 4 === 0) return { count: 0, sum: 0 }
  const count = 3 + (h % 10)
  const avg = 2.6 + ((h >>> 4) % 22) / 10 // 2.6 to 4.7
  return { count, sum: Math.round(avg * count) }
}
