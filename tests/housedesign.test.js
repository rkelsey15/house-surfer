// Run with: npm test
import assert from 'node:assert/strict'
import { test } from 'node:test'
import { ERAS, SHAPE_NAMES, houseDesign } from '../src/lib/houseDesign.js'

const STYLES = Object.keys(ERAS)
const homes = (style, n = 300) => Array.from({ length: n }, (_, i) => ({ id: `h${i}-${style}`, style, units: 1 }))

test('same home gives the same design every time', () => {
  const home = { id: 'abc123', style: 'Craftsman era', units: 2 }
  assert.deepEqual(houseDesign(home), houseDesign({ ...home }))
})

test('every era has several palettes, several variants and a known shape', () => {
  for (const style of STYLES) {
    assert.ok(ERAS[style].palettes.length >= 8, style + ' palettes')
    assert.ok(ERAS[style].variants >= 3, style + ' variants')
    assert.ok(SHAPE_NAMES.includes(ERAS[style].shape), style + ' shape')
    for (const p of ERAS[style].palettes) assert.ok(p.wall && p.roof && p.trim && p.door)
  }
})

test('a few hundred homes of one era show every variant and most palettes', () => {
  for (const style of STYLES) {
    const designs = homes(style).map(houseDesign)
    assert.equal(new Set(designs.map((d) => d.variant)).size, ERAS[style].variants, style + ' variants used')
    assert.ok(new Set(designs.map((d) => d.palette.wall + d.palette.roof)).size >= 7, style + ' palettes used')
  }
})

test('the feed looks varied: many different overall looks across eras', () => {
  const all = STYLES.flatMap((s) => homes(s, 120)).map(houseDesign)
  const looks = new Set(
    all.map((d) => [d.shape, d.variant, d.palette.wall, d.flip, d.chimney, d.trees.left, d.trees.right, d.fence, d.cloud].join('|')),
  )
  assert.ok(looks.size > 600, 'distinct looks: ' + looks.size)
  // Every shape family shows up.
  for (const shape of SHAPE_NAMES) assert.ok(all.some((d) => d.shape === shape), shape)
})

test('unknown styles fall back; units stay between 1 and 3; neighbors get a different wall', () => {
  const d = houseDesign({ id: 'x', style: 'Something new', units: 9 })
  assert.equal(d.units, 3)
  assert.equal(houseDesign({ id: 'x', style: 'Modern' }).units, 1)
  for (const h of homes('Pre-war', 50)) {
    const dd = houseDesign(h)
    assert.notEqual(dd.neighborWall, dd.palette.wall)
  }
})
