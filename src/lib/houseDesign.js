// Design choices for the house drawings, kept apart from the drawing code so
// they can be tested. Same home in, same design out: nothing here is random.
//
//   style (era from year built) -> shape family + a set of color palettes
//   home id                     -> variant (roof/porch shape), palette, chimney,
//                                  yard trees, fence, flowers, clouds, sun spot

// Small stable number from a string.
export function hash(str) {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) h = Math.imul(h ^ str.charCodeAt(i), 16777619)
  return h >>> 0
}

// Palettes are { wall, roof, trim, door }. Colors are kept muted so the feed looks
// calm, but each era has its own mood (painted ladies, earthy craftsman, pastel cottages...).
const P = (wall, roof, trim, door) => ({ wall, roof, trim, door })

export const ERAS = {
  'Victorian era': {
    shape: 'victorian',
    variants: 3,
    palettes: [
      P('#c9d3ea', '#3c4766', '#f4efe6', '#8a3b3b'),
      P('#d9c6e0', '#5b3f63', '#fff7ec', '#2f5d62'),
      P('#bcd8cf', '#38524c', '#f8f1df', '#a8473b'),
      P('#e8b9b9', '#6b3a3a', '#fff4e6', '#2f4a6b'),
      P('#f2dfa0', '#7a4b2b', '#fffaf0', '#3d5a80'),
      P('#a9c4d9', '#2e4057', '#f6f2ea', '#b5651d'),
      P('#d7b8a0', '#4a3028', '#fbeede', '#2f6f6a'),
      P('#cbd9b3', '#46573a', '#faf3e0', '#8c2f39'),
    ],
  },
  'Craftsman era': {
    shape: 'craftsman',
    variants: 4,
    palettes: [
      P('#bcd8cf', '#38524c', '#ffffff', '#7a4b2b'),
      P('#d6e4c3', '#4f5b3a', '#f7f1e1', '#8c3b2a'),
      P('#e8d3a8', '#7a4b2b', '#fff8ea', '#2f5d62'),
      P('#c9b8a0', '#5a3e36', '#f4ead8', '#3b5b7a'),
      P('#a7b9c9', '#34495e', '#f5efe3', '#9b4a2f'),
      P('#b9c7a0', '#3f4a2c', '#f2ebd7', '#6b3e26'),
      P('#d9a98a', '#5a3a2c', '#f8efdc', '#2e5a54'),
      P('#8fa8a0', '#2f423d', '#efe8d6', '#b0652a'),
    ],
  },
  'Pre-war': {
    shape: 'cottage',
    variants: 3,
    palettes: [
      P('#f2c4a8', '#5a3e36', '#fff6ea', '#3b6b72'),
      P('#f4e1a6', '#7a4b2b', '#fffaf0', '#8f3b3b'),
      P('#e8b9b9', '#6b3a3a', '#fff4e6', '#3f6b57'),
      P('#efe6d2', '#4f5b3a', '#ffffff', '#a14a3a'),
      P('#cfe3d6', '#3d5a50', '#fbf6ea', '#c06a3a'),
      P('#d9d4ea', '#4b4468', '#fffaf0', '#7a3f55'),
      P('#f6d6c2', '#7a3d2e', '#fff8ee', '#2f5266'),
      P('#e4ecd0', '#566b3a', '#fffdf4', '#9b4b32'),
    ],
  },
  'Mid-century': {
    shape: 'ranch',
    variants: 3,
    palettes: [
      P('#f4e1a6', '#7a4b2b', '#fffaf0', '#c0583a'),
      P('#d6e4c3', '#4f5b3a', '#f6f1e4', '#d99a2b'),
      P('#cfd8dc', '#4a5560', '#ffffff', '#e0784a'),
      P('#e8c9a0', '#5a3e36', '#fff6e8', '#3a7a7a'),
      P('#bfdad6', '#3b5a5a', '#fbf7ec', '#d9733f'),
      P('#f0cfc2', '#5e4a44', '#fffaf2', '#4a7f8c'),
      P('#d8d3c4', '#464a44', '#ffffff', '#c9902f'),
      P('#c6d6e2', '#3d4f63', '#fbf8f0', '#c4583c'),
    ],
  },
  'Late century': {
    shape: 'colonial',
    variants: 3,
    palettes: [
      P('#c9d3ea', '#3c4766', '#ffffff', '#2f4a6b'),
      P('#cfd8dc', '#4a5560', '#f8f8f4', '#8a3b3b'),
      P('#e0d0b8', '#5a3e36', '#fffaf0', '#3b5b4a'),
      P('#d6e4c3', '#38524c', '#fbfaf0', '#7a3f2a'),
      P('#e6c9bd', '#6a4038', '#fff8f0', '#33557a'),
      P('#d4cdbc', '#4d4a44', '#ffffff', '#6d3b3b'),
      P('#c3d4cf', '#3f5855', '#f7f6ee', '#9d5a2e'),
      P('#d9d6e6', '#4a4a6a', '#ffffff', '#3c6a62'),
    ],
  },
  Modern: {
    shape: 'modern',
    variants: 4,
    palettes: [
      P('#e8e4dc', '#55635f', '#ffffff', '#c9663a'),
      P('#f4e1a6', '#7a4b2b', '#f6f1e4', '#2f4a6b'),
      P('#cfd8dc', '#3c4766', '#ffffff', '#d99a2b'),
      P('#b9c2bd', '#5a3e36', '#f2eee6', '#3a7a7a'),
      P('#2f3a3a', '#d9d4c8', '#e8e4dc', '#e0784a'),
      P('#f0ece4', '#2e3438', '#ffffff', '#8a6a3f'),
      P('#9aa8a3', '#2d3b3a', '#eef0ea', '#d4a03a'),
      P('#d8c8b4', '#4a3f38', '#faf6ee', '#4a6f8a'),
    ],
  },
}
const FALLBACK = ERAS['Pre-war']

export const SHAPE_NAMES = ['victorian', 'craftsman', 'cottage', 'ranch', 'colonial', 'modern']
export const TREES = ['bush', 'round', 'pine', 'tall', 'none']
export const BRICKS = ['#9b5a44', '#8a4f3f', '#a8644a', '#7d4a3c']
export const FLOWER_COLORS = [['#e8664a', '#f4c542'], ['#d46aa5', '#f2e6ff'], ['#f4c542', '#ffffff'], ['#7f6ad4', '#f4a6c8']]

export function houseDesign(home) {
  const era = ERAS[home.style] ?? FALLBACK
  const id = String(home.id)
  const h = hash(id)
  const n = (salt, mod) => hash(id + salt) % mod
  const palette = era.palettes[n('p', era.palettes.length)]
  const other = era.palettes[(n('p', era.palettes.length) + 1 + n('q', era.palettes.length - 1)) % era.palettes.length]
  const units = Math.min(Math.max(home.units || 1, 1), 3)
  return {
    id,
    era: era.shape,
    shape: era.shape,
    variant: n('v', era.variants),
    flip: n('f', 2) === 1, // mirror the house left to right
    palette,
    neighborWall: other.wall, // alternate units get another wall color so they read as separate homes
    chimney: n('c', 3) === 0,
    brick: BRICKS[n('b', BRICKS.length)],
    trees: { left: TREES[n('l', TREES.length)], right: TREES[n('r', TREES.length)] },
    fence: n('fe', 4) === 0,
    flowers: n('fl', 3) === 0 ? FLOWER_COLORS[n('fc', FLOWER_COLORS.length)] : null,
    cloud: n('cl', 3), // 0 none, 1 one cloud, 2 two clouds
    sunX: 262 - (h % 3) * 24,
    bushL: 18 + (h % 7),
    bushR: 14 + ((h >> 3) % 7),
    units,
  }
}
