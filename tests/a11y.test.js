// Run with: npm test
import assert from 'node:assert/strict'
import { test } from 'node:test'
import { houseAlt, ratedText, starLabel } from '../src/lib/a11y.js'
import { WHY_MESSAGE } from '../src/lib/moderation-words.js'
import { PIN_FILTERS, PIN_COLORS, PIN_KINDS, PIN_SHAPES, pinShape, shapePoints } from '../src/lib/pins.js'

test('stars read "Rate N of 5 stars" and the pick is announced', () => {
  assert.equal(starLabel(4), 'Rate 4 of 5 stars')
  assert.equal(starLabel(1), 'Rate 1 of 5 stars')
  assert.equal(ratedText(4), 'You rated this 4 of 5')
})

test('house drawings get a one-line description from the data', () => {
  assert.equal(houseAlt({ style: 'Craftsman era', type: 'Duplex', yearBuilt: 1924 }), 'Illustration of a Craftsman-era duplex, built 1924')
  assert.equal(houseAlt({ style: 'Mid-century', type: 'Single-family', yearBuilt: 1962 }), 'Illustration of a mid-century house, built 1962')
  assert.equal(houseAlt({ style: 'Weird', type: 'Triplex' }), 'Illustration of a triplex')
})

test('every pin kind has its own shape (not only its own color)', () => {
  const shapes = PIN_KINDS.map(pinShape)
  assert.equal(new Set(shapes).size, PIN_KINDS.length)
  assert.equal(new Set(Object.values(PIN_COLORS)).size, PIN_KINDS.length)
  assert.deepEqual(Object.keys(PIN_SHAPES).sort(), [...PIN_KINDS].sort())
})

test('polygon pins have the right number of corners', () => {
  assert.equal(shapePoints('square', 6).length, 4)
  assert.equal(shapePoints('diamond', 6).length, 4)
  assert.equal(shapePoints('star', 6).length, 10)
  assert.equal(shapePoints('circle', 6).length, 0)
})

test('the filter chips cover every pin kind plus the flame and crown', () => {
  for (const kind of PIN_KINDS) assert.ok(PIN_FILTERS.some((row) => row.kind === kind), kind)
  assert.ok(PIN_FILTERS.some((row) => row.badge === 'flame'))
  assert.ok(PIN_FILTERS.some((row) => row.badge === 'crown'))
})

test('the blocked-comment "Why?" line names the house rule', () => {
  assert.match(WHY_MESSAGE, /^Why\?/)
  assert.match(WHY_MESSAGE, /house/i)
  assert.match(WHY_MESSAGE, /people who live there/)
})
