// Run with: npm test
import assert from 'node:assert/strict'
import { test } from 'node:test'
import { LOCKED_BADGES, myComments, recentActivity, relativeTime } from '../src/lib/profileLists.js'

const c = (id, user, created_at, extra = {}) => ({ id, home_id: 'h1', user, created_at, deleted_at: null, ...extra })

test('myComments: mine only, no deleted, newest first (AC 6.2)', () => {
  const rows = myComments(
    [c('a', 'Me', '2026-01-01T00:00:00Z'), c('b', 'Other', '2026-01-02T00:00:00Z'), c('d', 'Me', '2026-01-03T00:00:00Z', { deleted_at: 'x' }), c('e', 'Me', '2026-01-04T00:00:00Z')],
    'Me',
  )
  assert.deepEqual(rows.map((r) => r.id), ['e', 'a'])
})

test('myComments: none gives an empty list (AC 6.3)', () => {
  assert.deepEqual(myComments([], 'Me'), [])
})

test('relativeTime wording (AC 6.4)', () => {
  const now = Date.parse('2026-11-22T12:00:00Z')
  const ago = (s) => relativeTime(new Date(now - s * 1000).toISOString(), now)
  assert.equal(ago(10), 'just now')
  assert.equal(ago(120), '2 min ago')
  assert.equal(ago(3 * 3600), '3 hr ago')
  assert.equal(ago(30 * 3600), 'yesterday')
  assert.equal(ago(3 * 86400), '3 days ago')
})

test('recentActivity: mixes kinds, newest first, capped at 10 (AC 6.4)', () => {
  const out = recentActivity({
    ratings: { h1: { stars: 4, at: '2026-01-01T00:00:00Z' } },
    comments: [c('a', 'Me', '2026-01-02T00:00:00Z'), c('z', 'Other', '2026-01-02T01:00:00Z')],
    likes: [{ comment_id: 'z', user: 'Me', created_at: '2026-01-03T00:00:00Z' }, { comment_id: 'z', user: 'Other', created_at: '2026-01-09T00:00:00Z' }],
    photos: [{ id: 'p1', home_id: 'h1', created_at: '2026-01-04T00:00:00Z' }],
    me: 'Me',
  })
  assert.deepEqual(out.map((i) => i.kind), ['snapped', 'liked', 'commented', 'rated'])
  const many = Object.fromEntries(Array.from({ length: 15 }, (_, i) => [`h${i}`, { stars: 3, at: `2026-02-${String(i + 1).padStart(2, '0')}T00:00:00Z` }]))
  assert.equal(recentActivity({ ratings: many, comments: [], likes: [], photos: [], me: 'Me' }).length, 10)
})

test('badges: all have a name and a how-to (AC 6.5)', () => {
  assert.ok(LOCKED_BADGES.length >= 4)
  assert.ok(LOCKED_BADGES.every((b) => b.name && b.how))
  assert.ok(LOCKED_BADGES.some((b) => b.how === 'Rate 25 homes'))
})
