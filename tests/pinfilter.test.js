// The map's pin filter chips: which homes pass, what is remembered, what a screen reader says.
import test from 'node:test'
import assert from 'node:assert/strict'
import { PIN_FILTERS, PIN_FILTER_KEYS, cleanPinFilter, passesPinFilter, pinFilterName } from '../src/lib/pins.js'

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

test('the saved choice is cleaned: unknown keys dropped, bad data means all on', () => {
  assert.deepEqual(cleanPinFilter(['high', 'nonsense']), ['high'])
  assert.deepEqual(cleanPinFilter([]), [])
  assert.deepEqual(cleanPinFilter(null), PIN_FILTER_KEYS)
  assert.deepEqual(cleanPinFilter('x'), PIN_FILTER_KEYS)
})

test('chip names say the state, and contain the visible label', () => {
  const gold = PIN_FILTERS.find((f) => f.key === 'high')
  assert.equal(pinFilterName(gold, true), 'Gold homes, shown')
  assert.equal(pinFilterName(gold, false), 'Gold homes, hidden')
  for (const f of PIN_FILTERS) assert.ok(f.name.toLowerCase().includes(f.label.toLowerCase()), f.label)
})
