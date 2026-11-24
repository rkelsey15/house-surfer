// Run with: npm test
// The house drawings: roofs sit on their walls, are centered and overhang a little;
// fences leave a gate gap at the front door in every shape, variant and mirrored layout.
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import { ERAS } from '../src/lib/houseDesign.js'
import { DOORS, FENCE, G, GATE_ROOM, Hp, OVER, fenceParts, gateFor, roofPoints, roofY } from '../src/lib/houseGeometry.js'

test('a gable roof is centered on its wall, overhangs a little, and reaches below the wall top', () => {
  for (const [x0, x1] of [[64, 236], [106, 194], [182, 246], [66, 96]]) {
    const pts = roofPoints(G(x0, x1, 80, 40))
    assert.equal((pts[0][0] + pts[2][0]) / 2, (x0 + x1) / 2, 'centered')
    assert.equal(pts[2][0] - x1, x0 - pts[0][0], 'same overhang both sides')
    assert.ok(x0 - pts[0][0] <= 6, 'overhang is only a little')
    assert.equal(pts[1][0], (x0 + x1) / 2, 'peak is over the middle')
    assert.ok(pts[0][1] > 80 && pts[2][1] > 80, 'bottom edge reaches into the wall: no gap')
  }
})

test('a hip roof is centered too, and roofY follows its top edge', () => {
  const g = Hp(64, 236, 84, 46, 40)
  const pts = roofPoints(g)
  assert.equal(pts[0][0] + pts[3][0], 64 + 236, 'centered')
  assert.equal(roofY(g, 150), 46)
  assert.equal(roofY(g, 64 + 40), 46)
  assert.ok(roofY(g, 70) > 46 && roofY(g, 70) < 85)
  assert.equal(roofY(G(0, 100, 50, 10), 50), 10)
  assert.ok(OVER <= 6)
})

test('every drawn roof uses a helper (only the butterfly and shed roofs are hand-written, with their walls cut to match)', () => {
  const src = readFileSync(new URL('../src/components/HouseArt.jsx', import.meta.url), 'utf8')
  const rawRoofs = src.split('\n').filter((l) => /<polygon[^>]*fill=\{c\.roof\}/.test(l))
  assert.equal(rawRoofs.length, 2, rawRoofs.join('\n'))
})

test('every shape and variant has a door span', () => {
  for (const era of Object.values(ERAS)) {
    assert.equal(DOORS[era.shape]?.length, era.variants, era.shape)
    for (const [a, b] of DOORS[era.shape]) assert.ok(a < b && a >= 60 && b <= 240)
  }
})

test('the fence never covers a front door, in any shape, variant or mirror image', () => {
  for (const era of Object.values(ERAS)) {
    for (let v = 0; v < era.variants; v++) {
      for (const flip of [false, true]) {
        const [d0, d1] = gateFor(era.shape, v, flip)
        const { posts, rails, gap } = fenceParts([d0, d1])
        assert.ok(gap[0] <= d0 - GATE_ROOM + 1e-9 && gap[1] >= d1 + GATE_ROOM - 1e-9)
        for (const x of posts) assert.ok(x + FENCE.postW <= d0 || x >= d1, `post at ${x} covers the door of ${era.shape} ${v} flip=${flip}`)
        for (const [r0, r1] of rails) assert.ok(r1 <= d0 || r0 >= d1, 'rail crosses the door')
        assert.ok(posts.length > 8, 'there is still a fence')
      }
    }
  }
})

test('mirroring flips the gate across the scene', () => {
  const [a, b] = gateFor('ranch', 0, false)
  assert.deepEqual(gateFor('ranch', 0, true), [300 - b, 300 - a])
})
