// Geometry for the house drawings, kept apart from the drawing code so it can be tested.
// Scene is 300 x 170, the ground line is y = 150.

// Roofs are built from the walls they sit on, so they cannot drift:
//   G(x0, x1, base, peak)           gable roof on a wall from x0 to x1 whose top is y = base
//   Hp(x0, x1, base, peak, inset)   hip roof (flat ridge); `inset` is how far the ridge starts in from each wall end
// A roof is always centered on its wall, overhangs it by OVER on each side, and reaches 1 unit
// below the wall top (the wall is drawn first), so no gap and no hairline seam can show.
export const OVER = 5
export const G = (x0, x1, base, peak, over = OVER) => ({ kind: 'gable', x0, x1, base, peak, over })
export const Hp = (x0, x1, base, peak, inset, over = OVER) => ({ kind: 'hip', x0, x1, base, peak, inset, over })

export function roofPoints(g) {
  const a = g.x0 - g.over
  const b = g.x1 + g.over
  const y = g.base + 1
  return g.kind === 'hip'
    ? [[a, y], [g.x0 + g.inset, g.peak], [g.x1 - g.inset, g.peak], [b, y]]
    : [[a, y], [(g.x0 + g.x1) / 2, g.peak], [b, y]]
}

// Height of the roof's top edge at x (the wall top if x is outside the roof).
export function roofY(g, x) {
  const p = roofPoints(g)
  for (let i = 0; i < p.length - 1; i++) {
    const [x1, y1] = p[i]
    const [x2, y2] = p[i + 1]
    if (x >= x1 && x <= x2) return x2 === x1 ? y1 : y1 + ((x - x1) / (x2 - x1)) * (y2 - y1)
  }
  return g.base
}

// Where the front door is, per shape and variant: [left, right] x in the scene, before any
// mirroring. The fence skips this span plus GATE_ROOM either side, so a fence never covers a
// door. Keep in step with the door rect in each shape (src/components/HouseArt.jsx).
export const DOORS = {
  victorian: [[156, 180], [128, 150], [136, 162]],
  craftsman: [[138, 164], [138, 162], [138, 164], [138, 164]],
  cottage: [[134, 164], [136, 164], [164, 190]],
  ranch: [[76, 98], [88, 108], [160, 180]],
  colonial: [[138, 162], [132, 156], [138, 162]],
  modern: [[180, 204], [186, 216], [74, 92], [84, 104]],
}
export const GATE_ROOM = 9
export const FENCE = { x0: 58, x1: 242, first: 60, step: 7.6, count: 24, postW: 4.5 }

// Garage and carport doors, per shape and variant (an empty list means none). The fence leaves
// a gap here too, so a car could drive out. Keep in step with HouseArt.jsx like DOORS above.
export const GARAGES = {
  victorian: [[], [], []],
  craftsman: [[], [], [], []],
  cottage: [[], [], []],
  ranch: [[[176, 232]], [[182, 242]], []],
  colonial: [[], [[182, 246]], []],
  modern: [[], [], [[188, 226]], []],
}

// A span in scene coordinates (mirrored when the house is flipped).
const mirror = (span, flip) => (flip ? [300 - span[1], 300 - span[0]] : span)

// The front door span.
export function gateFor(shape, variant, flip) {
  return mirror(DOORS[shape]?.[variant] ?? [130, 170], flip)
}

// Every span the fence must leave open: the front door plus any garage or carport door.
export function gatesFor(shape, variant, flip) {
  const garages = GARAGES[shape]?.[variant] ?? []
  return [gateFor(shape, variant, flip), ...garages.map((g) => mirror(g, flip))]
}

// What the fence is made of: post x positions and the rail pieces, with a gap left open at each
// gate. `gates` is one [left, right] span or a list of them (see gatesFor).
export function fenceParts(gates) {
  const list = (typeof gates[0] === 'number' ? [gates] : gates)
    .map(([a, b]) => [a - GATE_ROOM, b + GATE_ROOM])
    .sort((a, b) => a[0] - b[0])
  const inGap = (x0, x1) => list.some(([g0, g1]) => x1 > g0 && x0 < g1)
  const posts = Array.from({ length: FENCE.count }, (_, i) => FENCE.first + i * FENCE.step).filter((x) => !inGap(x, x + FENCE.postW))
  // Rails: the fence's length minus each gap.
  let rails = [[FENCE.x0, FENCE.x1]]
  for (const [g0, g1] of list) {
    rails = rails.flatMap(([a, b]) => (g1 <= a || g0 >= b ? [[a, b]] : [[a, Math.min(g0, b)], [Math.max(g1, a), b]])).filter(([a, b]) => b - a > 0.01)
  }
  return { posts, rails, gaps: list, gap: list[0] }
}
