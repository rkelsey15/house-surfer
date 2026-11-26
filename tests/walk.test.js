// Run with: npm test
// Walkability: the formula in the data script, the label and chips in the app, and the data file.
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import { CATEGORIES, categoryOf, countsFor, makeIndex, walkScore } from '../scripts/walkability.mjs'
import { walkChips, walkLabel, walkSummary } from '../src/lib/walk.js'

const homes = JSON.parse(readFileSync(new URL('../public/data/homes.json', import.meta.url), 'utf8'))

test('weights add to 100; no places is 0; every cap met is 100; counts above a cap add nothing', () => {
  assert.equal(CATEGORIES.reduce((n, c) => n + c.weight, 0), 100)
  assert.equal(walkScore({}), 0)
  const full = Object.fromEntries(CATEGORIES.map((c) => [c.key, c.cap]))
  assert.equal(walkScore(full), 100)
  assert.equal(walkScore({ ...full, food: 500 }), 100)
})

test('half the cap in one category earns half its weight', () => {
  assert.equal(walkScore({ grocery: 2.5 }), 15)
})

test('OSM tags map to the five categories, and nothing else counts', () => {
  assert.equal(categoryOf({ shop: 'supermarket' }), 'grocery')
  assert.equal(categoryOf({ shop: 'convenience' }), 'grocery')
  assert.equal(categoryOf({ amenity: 'cafe' }), 'food')
  assert.equal(categoryOf({ amenity: 'restaurant' }), 'food')
  assert.equal(categoryOf({ leisure: 'park' }), 'parks')
  assert.equal(categoryOf({ highway: 'bus_stop' }), 'transit')
  assert.equal(categoryOf({ amenity: 'school' }), 'schools')
  assert.equal(categoryOf({ amenity: 'bar' }), null)
})

test('counting uses an 800 m radius', () => {
  const lat = 47.64, mLng = 111320 * Math.cos((lat * Math.PI) / 180)
  const at = (m) => ({ lat, lng: -122.35 + m / mLng, cat: 'parks' })
  const idx = makeIndex([at(700), at(799), at(850), at(3000)], lat)
  assert.equal(countsFor(idx, -122.35, lat).parks, 2)
})

test('label bands and summary text', () => {
  assert.equal(walkLabel(100), "Walker's paradise")
  assert.equal(walkLabel(86), 'Very walkable')
  assert.equal(walkLabel(60), 'Somewhat walkable')
  assert.equal(walkLabel(30), 'Car-dependent')
  assert.equal(walkSummary({ walk: 86 }), 'Very walkable, 86')
  assert.equal(walkSummary({}), null)
})

test('at most 4 chips, zero counts skipped, singular for one', () => {
  assert.deepEqual(walkChips({ grocery: 5, food: 22, transit: 38, parks: 6, schools: 2 }), [
    '5 grocery', '22 cafes and restaurants', '38 transit stops', '6 parks',
  ])
  assert.deepEqual(walkChips({ grocery: 0, parks: 1, schools: 1 }), ['1 park', '1 school'])
})

test('homes.json has a score and counts on every home, and no extra coordinates', () => {
  assert.ok(homes.every((h) => Number.isInteger(h.walk) && h.walk >= 0 && h.walk <= 100))
  assert.ok(homes.every((h) => Object.keys(h.places).sort().join() === 'food,grocery,parks,schools,transit'))
  assert.ok(homes.every((h) => walkScore(h.places) === h.walk))
})

test('steep hill flag: slope from four samples, flag only on steep homes', async () => {
  const { gradeAt, STEEP_GRADE } = await import('../scripts/elevation.mjs')
  const mPerDeg = 111320
  const slope = (g) => (lng, lat) => lat * mPerDeg * g // rises g metres per metre going north
  assert.ok(Math.abs(gradeAt(slope(0.2), -122.35, 47.64) - 0.2) < 1e-6)
  assert.equal(gradeAt(() => 50, -122.35, 47.64), 0)
  assert.equal(gradeAt(() => null, -122.35, 47.64), null)
  assert.ok(gradeAt(slope(0.2), -122.35, 47.64) >= STEEP_GRADE)
  assert.ok(gradeAt(slope(0.1), -122.35, 47.64) < STEEP_GRADE)
  const steep = homes.filter((h) => h.hill)
  assert.ok(steep.every((h) => h.hill === true))
  const share = steep.length / homes.length
  assert.ok(share > 0.1 && share < 0.4, `steep share ${share}`)
})

test('the saved file has no exact heights or extra coordinates', () => {
  const allowed = new Set(['id', 'address', 'lat', 'lng', 'beds', 'baths', 'sqft', 'yearBuilt', 'type', 'units', 'style', 'lastSaleYear', 'walk', 'places', 'hill'])
  assert.ok(homes.every((h) => Object.keys(h).every((k) => allowed.has(k))))
})
