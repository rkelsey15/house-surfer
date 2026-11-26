// The map's pin filter chips: which homes pass, what is remembered, what a screen reader says.
import test from 'node:test'
import assert from 'node:assert/strict'
import { DEFAULT_PIN_FILTER, PIN_FILTERS, PIN_FILTER_KEYS, cleanPinFilter, isDefaultPinFilter, passesPinFilter, pinFilterName } from '../src/lib/pins.js'

test('all chips on shows every home', () => {
  for (const kind of ['unrated', 'low', 'mid', 'high', 'week']) {
    for (const hot of [false, true]) assert.ok(passesPinFilter(kind, hot, PIN_FILTER_KEYS))
  }
})

test('none shows nothing', () => {
  assert.ok(!passesPinFilter('mid', true, []))
})

test('a pin chip shows only its own type; Hot adds the flame homes', () => {
  assert.ok(passesPinFilter('high', false, ['high']))
  assert.ok(!passesPinFilter('mid', false, ['high']))
  assert.ok(!passesPinFilter('mid', true, ['high']))
  assert.ok(passesPinFilter('mid', true, ['hot']))
  assert.ok(!passesPinFilter('mid', false, ['hot']))
})

test('the saved choice is cleaned: unknown keys dropped, bad data means the default (top homes)', () => {
  assert.deepEqual(cleanPinFilter(['high', 'nonsense']), ['high'])
  assert.deepEqual(cleanPinFilter([]), [])
  assert.deepEqual(cleanPinFilter(null), DEFAULT_PIN_FILTER)
  assert.deepEqual(cleanPinFilter('x'), DEFAULT_PIN_FILTER)
  // A returning visitor's saved choice is kept as is.
  assert.deepEqual(cleanPinFilter(PIN_FILTER_KEYS), PIN_FILTER_KEYS)
})

test('chip names say the state, and contain the visible label', () => {
  const gold = PIN_FILTERS.find((f) => f.key === 'high')
  assert.equal(pinFilterName(gold, true), 'Gold homes, shown')
  assert.equal(pinFilterName(gold, false), 'Gold homes, hidden')
  for (const f of PIN_FILTERS) assert.ok(f.name.toLowerCase().includes(f.label.toLowerCase()), f.label)
})

test('the map starts on the standout pins: Gold, Hot and Home of the week', () => {
  assert.deepEqual([...DEFAULT_PIN_FILTER].sort(), ['high', 'hot', 'week'])
  assert.ok(isDefaultPinFilter(['week', 'hot', 'high']))
  assert.ok(!isDefaultPinFilter(PIN_FILTER_KEYS))
  assert.ok(!isDefaultPinFilter([]))
  const on = DEFAULT_PIN_FILTER
  assert.ok(passesPinFilter('high', false, on))
  assert.ok(passesPinFilter('week', false, on))
  assert.ok(passesPinFilter('low', true, on), 'hot homes show')
  assert.ok(!passesPinFilter('unrated', false, on))
  assert.ok(!passesPinFilter('mid', false, on))
})

test('a home the visitor rated also shows by default, but not when None is on', () => {
  assert.ok(passesPinFilter('low', false, DEFAULT_PIN_FILTER, true))
  assert.ok(passesPinFilter('unrated', false, ['high'], true))
  assert.ok(!passesPinFilter('low', false, [], true))
  assert.ok(!passesPinFilter('low', false, DEFAULT_PIN_FILTER, false))
})

test('the default shows 30 or more homes in the real data (so the map is not empty)', async () => {
  const { readFileSync } = await import('node:fs')
  const { sampleRating, sampleRecentRatings } = await import('../src/lib/sampleData.js')
  const { GOLD_MIN, GOLD_MIN_RATINGS, HOT_MIN_ACTIVITY } = await import('../src/lib/rules.js')
  const homes = JSON.parse(readFileSync(new URL('../public/data/homes.json', import.meta.url), 'utf8')).filter((h) => h.type !== 'Townhouse')
  let n = 0
  for (const h of homes) {
    const { count, sum } = sampleRating(h.id)
    const hot = sampleRecentRatings(h.id) >= HOT_MIN_ACTIVITY
    const gold = count >= GOLD_MIN_RATINGS && sum / count >= GOLD_MIN
    if (hot || gold) n++
  }
  assert.ok(n >= 30, 'default homes: ' + n)
})
