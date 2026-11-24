// Map pin look: each kind differs by SHAPE as well as color, so the map still
// reads for people with a color vision difference (WCAG 1.4.1).
//
//   unrated  hollow gray circle
//   low      blue filled circle   (under 3.5)
//   mid      green filled square  (3.5 to 4.4)
//   high     gold filled star     (4.5+ with 3+ ratings)
//   week     purple filled diamond, with a crown badge on top
//   hot      a flame badge on top of whatever pin the home has

export const PIN_KINDS = ['unrated', 'low', 'mid', 'high', 'week']

// Fixed hex values so they read on both the light and dark map.
export const PIN_COLORS = { unrated: '#8a9591', low: '#2f7fd0', mid: '#2e9e6b', high: '#f2c200', week: '#8e5bd0' }

export const PIN_SHAPES = { unrated: 'circle-hollow', low: 'circle', mid: 'square', high: 'star', week: 'diamond' }

export const pinShape = (kind) => PIN_SHAPES[kind] ?? 'circle'

// The map's filter chips, in the order they show. Each chip is also the legend: it draws the
// pin (`kind`) and/or the flame or crown (`badge`). `name` is what a screen reader says.
export const PIN_FILTERS = [
  { key: 'unrated', kind: 'unrated', label: 'Unrated', name: 'Unrated homes' },
  { key: 'low', kind: 'low', label: 'Under 3.5', name: 'Homes under 3.5' },
  { key: 'mid', kind: 'mid', label: '3.5 to 4.4', name: 'Homes rated 3.5 to 4.4' },
  { key: 'high', kind: 'high', label: 'Gold', name: 'Gold homes' },
  { key: 'hot', badge: 'flame', label: 'Hot', name: 'Hot homes' },
  { key: 'week', kind: 'week', badge: 'crown', label: 'Home of the week', name: 'Home of the week' },
]
export const PIN_FILTER_KEYS = PIN_FILTERS.map((f) => f.key)

// A home shows when its pin type is on, or when it is hot and "Hot" is on (the flame sits on
// top of any pin type). `on` is the list of chip keys that are switched on.
export const passesPinFilter = (kind, hot, on) => on.includes(kind) || (hot && on.includes('hot'))

// Read the saved choice back: keep only known keys; anything unreadable means "all on".
export const cleanPinFilter = (saved) => (Array.isArray(saved) ? PIN_FILTER_KEYS.filter((k) => saved.includes(k)) : PIN_FILTER_KEYS)

// Screen reader name for a chip, like "Gold homes, shown".
export const pinFilterName = (f, isOn) => `${f.name}, ${isOn ? 'shown' : 'hidden'}`

// Corner points of a polygon pin, centered on (0, 0), for a pin of radius r.
// Circles have no points (they are drawn with an arc).
export function shapePoints(shape, r) {
  if (shape === 'square') {
    const s = r * 0.9
    return [[-s, -s], [s, -s], [s, s], [-s, s]]
  }
  if (shape === 'diamond') {
    const s = r * 1.25
    return [[0, -s], [s, 0], [0, s], [-s, 0]]
  }
  if (shape === 'star') {
    const outer = r * 1.45
    const inner = outer * 0.45
    return Array.from({ length: 10 }, (_, i) => {
      const a = -Math.PI / 2 + (i * Math.PI) / 5
      const d = i % 2 === 0 ? outer : inner
      return [Math.cos(a) * d, Math.sin(a) * d]
    })
  }
  return []
}

// How a pin is outlined: gold gets a dark rim so it can't pass for orange,
// unrated is outline only, the rest get a white rim.
export function pinStyle(kind, radius, big = false) {
  const ring = big ? 1.5 : 1
  if (kind === 'unrated') {
    return { radius: Math.max(2, Math.round(radius * 0.75)), color: PIN_COLORS.unrated, weight: radius > 5 ? 2 : 1.5, fill: false, fillColor: PIN_COLORS.unrated, fillOpacity: 0 }
  }
  if (kind === 'high') {
    return { radius, color: '#4a3b00', weight: ring * 1.5, fill: true, fillColor: PIN_COLORS.high, fillOpacity: 1 }
  }
  return { radius, color: '#ffffff', weight: radius > 5 ? 2 * ring : ring, fill: true, fillColor: PIN_COLORS[kind], fillOpacity: 0.95 }
}
