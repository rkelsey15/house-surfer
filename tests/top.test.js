// Run with: npm test
import assert from 'node:assert/strict'
import { test } from 'node:test'
import { homeOfTheWeek, hotThisWeek, topRated } from '../src/lib/top.js'

const homes = ['a', 'b', 'c', 'd', 'e', 'f'].map((id) => ({ id, address: `${id} block of Test St` }))
const stat = (avg, count, extra = {}) => ({ avg, count, hot: false, activity: 0, week: false, ...extra })

const stats = new Map([
  ['a', stat(4.8, 5)], // gold
  ['b', stat(5.0, 2)], // perfect average, but only 2 ratings: not gold (AC 5.2)
  ['c', stat(4.5, 3)], // exactly on the line: gold
  ['d', stat(4.4, 40)], // just under 4.5: not gold
  ['e', stat(null, 0)], // unrated
  ['f', stat(4.8, 9, { hot: true, activity: 6, week: true })], // gold, hot and home of the week
])

test('top rated uses the gold rule: 4.5+ with 3+ ratings (AC 5.1, 5.2)', () => {
  const ids = topRated(homes, stats).map((r) => r.home.id)
  assert.deepEqual(ids, ['f', 'a', 'c'])
  assert.ok(!ids.includes('b'), 'a 5.0 with 2 ratings must not appear')
  assert.ok(!ids.includes('d'), '4.4 is below the line')
})

test('top rated is best first, then most ratings', () => {
  const ids = topRated(homes, stats).map((r) => r.home.id)
  assert.deepEqual(ids, ['f', 'a', 'c']) // f and a tie on 4.8; f has more ratings
})

test('hot this week lists flame homes, most activity first (AC 5.3)', () => {
  const s = new Map(stats)
  s.set('a', stat(4.8, 5, { hot: true, activity: 3 }))
  s.set('d', stat(4.4, 40, { hot: true, activity: 9 }))
  assert.deepEqual(hotThisWeek(homes, s).map((r) => r.home.id), ['d', 'f', 'a'])
})

test('home of the week is the crown home, or null (AC 5.4)', () => {
  assert.equal(homeOfTheWeek(homes, stats).home.id, 'f')
  assert.equal(homeOfTheWeek(homes, new Map([['a', stat(4.8, 5)]])), null)
})

test('empty data gives empty lists, not errors (AC 5.5)', () => {
  assert.deepEqual(topRated([], new Map()), [])
  assert.deepEqual(hotThisWeek([], new Map()), [])
  assert.equal(homeOfTheWeek([], new Map()), null)
  assert.deepEqual(topRated(homes, new Map()), [])
})
