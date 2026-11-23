// Run with: npm test
import assert from 'node:assert/strict'
import { test } from 'node:test'
import { dailyCounts, isSingleVisitor, northStar } from '../src/lib/stats.js'

const now = new Date('2026-11-22T12:00:00').getTime()
const ev = (name, daysAgo, handle = 'Me') => ({ name, handle, at: new Date(now - daysAgo * 86400000).toISOString() })

test('dailyCounts: 14 days, counts per event, ignores older (AC 7.5)', () => {
  const out = dailyCounts([ev('rating_submitted', 0), ev('rating_submitted', 0), ev('home_viewed', 3), ev('home_viewed', 20)], now)
  assert.equal(out.days.length, 14)
  assert.equal(out.days.at(-1), '2026-11-22')
  const rating = out.rows.find((r) => r.name === 'rating_submitted')
  assert.equal(rating.counts.at(-1), 2)
  assert.equal(out.rows.find((r) => r.name === 'home_viewed').total, 1)
  assert.equal(out.rows.find((r) => r.name === 'theme_changed').total, 0)
})

test('northStar: ratings per active user per week (AC 7.6)', () => {
  const events = [
    ev('rating_submitted', 1), ev('rating_submitted', 2), ev('home_viewed', 2),
    ev('rating_submitted', 1, 'Other'),
    ev('rating_submitted', 9),
  ]
  const [thisWeek, lastWeek, older] = northStar(events, now, 3)
  assert.deepEqual([thisWeek.ratings, thisWeek.active], [3, 2])
  assert.equal(thisWeek.perUser, 1.5)
  assert.deepEqual([lastWeek.ratings, lastWeek.active, lastWeek.perUser], [1, 1, 1])
  assert.equal(older.perUser, 0)
})

test('isSingleVisitor (AC 7.7)', () => {
  assert.equal(isSingleVisitor([]), true)
  assert.equal(isSingleVisitor([ev('app_opened', 0), ev('app_opened', 1)]), true)
  assert.equal(isSingleVisitor([ev('app_opened', 0), ev('app_opened', 1, 'Other')]), false)
})
