// House illustrations, drawn in code (no photos, no listing images).
// Based on the four drawings in design/prototype.html, plus one extra "ranch"
// shape so Mid-century and Late-century homes don't borrow another era's look.
//
// How a home maps to a drawing:
//   - style (era from year built)  -> shape + color palette
//   - units (1, 2 or 3)            -> one house, or 2 or 3 attached homes
//   - home id                      -> picks one of several colors, so
//                                     neighbors from the same era still differ
// Same home in, same picture out. It never changes between visits.

// Each shape is drawn in a 300 x 170 scene, standing on the ground line y=150,
// roughly between x=50 and x=250.
const SHAPES = {
  // Victorian: tall gabled house with a turret
  victorian: ({ wall, roof }) => (
    <>
      <polygon points="150,44 200,74 100,74" fill={roof} />
      <rect x="106" y="74" width="88" height="76" fill={wall} />
      <polygon points="214,24 236,58 192,58" fill={roof} />
      <rect x="196" y="58" width="36" height="92" fill={wall} />
      <rect x="204" y="70" width="20" height="24" fill="#fff" opacity=".85" />
      <rect x="118" y="88" width="24" height="26" fill="#fff" opacity=".85" />
      <rect x="156" y="112" width="24" height="38" fill={roof} />
      <rect x="66" y="96" width="40" height="54" fill={wall} opacity=".85" />
      <polygon points="62,96 86,80 110,96" fill={roof} />
    </>
  ),
  // Craftsman: low gable with a covered front porch and columns
  craftsman: ({ wall, roof }) => (
    <>
      <polygon points="50,78 150,36 250,78" fill={roof} />
      <rect x="64" y="78" width="172" height="72" fill={wall} />
      <rect x="64" y="112" width="172" height="6" fill={roof} opacity=".6" />
      <rect x="72" y="118" width="8" height="32" fill="#fff" />
      <rect x="220" y="118" width="8" height="32" fill="#fff" />
      <rect x="138" y="118" width="26" height="32" fill={roof} />
      <rect x="92" y="86" width="40" height="20" fill="#fff" opacity=".85" />
      <rect x="170" y="86" width="40" height="20" fill="#fff" opacity=".85" />
    </>
  ),
  // Cottage (pre-war): small, steep roof, round attic window
  cottage: ({ wall, roof }) => (
    <>
      <polygon points="60,70 150,22 240,70" fill={roof} />
      <rect x="74" y="70" width="152" height="80" fill={wall} />
      <rect x="134" y="104" width="30" height="46" fill={roof} opacity=".85" />
      <rect x="90" y="88" width="30" height="24" fill="#fff" opacity=".85" />
      <rect x="180" y="88" width="30" height="24" fill="#fff" opacity=".85" />
      <circle cx="150" cy="52" r="8" fill="#fff" opacity=".8" />
    </>
  ),
  // Ranch (mid and late century): long, low roof, attached garage
  ranch: ({ wall, roof }) => (
    <>
      <polygon points="42,82 150,54 258,82" fill={roof} />
      <rect x="56" y="82" width="188" height="68" fill={wall} />
      <rect x="76" y="110" width="22" height="40" fill={roof} opacity=".85" />
      <rect x="112" y="96" width="48" height="20" fill="#fff" opacity=".85" />
      <rect x="176" y="108" width="56" height="42" fill={roof} opacity=".55" />
      <path d="M176 122h56M176 136h56" stroke="#fff" strokeWidth="1.5" opacity=".6" />
    </>
  ),
  // Modern: flat roof, big windows
  modern: ({ wall, roof }) => (
    <>
      <rect x="70" y="40" width="160" height="110" fill={wall} />
      <rect x="62" y="34" width="176" height="10" fill={roof} />
      <rect x="84" y="56" width="70" height="40" fill="#fff" opacity=".85" />
      <rect x="170" y="56" width="44" height="94" fill={roof} opacity=".8" />
      <rect x="84" y="108" width="70" height="26" fill="#fff" opacity=".85" />
    </>
  ),
}

// Colors for each era: [wall, roof] pairs, taken from the prototype's palette
// and extended. The home id picks one pair.
const ERAS = {
  'Victorian era': { shape: 'victorian', colors: [['#c9d3ea', '#3c4766'], ['#d9c6e0', '#5b3f63'], ['#bcd8cf', '#38524c'], ['#e8b9b9', '#6b3a3a']] },
  'Craftsman era': { shape: 'craftsman', colors: [['#bcd8cf', '#38524c'], ['#d6e4c3', '#4f5b3a'], ['#e8d3a8', '#7a4b2b'], ['#c9b8a0', '#5a3e36']] },
  'Pre-war': { shape: 'cottage', colors: [['#f2c4a8', '#5a3e36'], ['#f4e1a6', '#7a4b2b'], ['#e8b9b9', '#6b3a3a'], ['#efe6d2', '#4f5b3a']] },
  'Mid-century': { shape: 'ranch', colors: [['#f4e1a6', '#7a4b2b'], ['#d6e4c3', '#4f5b3a'], ['#cfd8dc', '#4a5560'], ['#e8c9a0', '#5a3e36']] },
  'Late century': { shape: 'ranch', colors: [['#c9d3ea', '#3c4766'], ['#cfd8dc', '#4a5560'], ['#e0d0b8', '#5a3e36'], ['#d6e4c3', '#38524c']] },
  Modern: { shape: 'modern', colors: [['#e8e4dc', '#55635f'], ['#f4e1a6', '#7a4b2b'], ['#cfd8dc', '#3c4766'], ['#b9c2bd', '#5a3e36']] },
}
const FALLBACK = ERAS['Pre-war']

// Small stable number from a string (the home id).
function hash(str) {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) h = Math.imul(h ^ str.charCodeAt(i), 16777619)
  return h >>> 0
}

export default function HouseArt({ home, height = 210 }) {
  const era = ERAS[home.style] ?? FALLBACK
  const Shape = SHAPES[era.shape]
  const h = hash(home.id)
  const [wall, roof] = era.colors[h % era.colors.length]
  const units = Math.min(Math.max(home.units || 1, 1), 3)

  // One house, or 2 or 3 homes side by side, each drawn smaller so they fit.
  // Neighboring units get different wall colors so they read as separate homes.
  const scale = units === 1 ? 1 : units === 2 ? 0.68 : 0.46
  const width = 200 * scale
  const left = 150 - (width * units) / 2
  const copies = Array.from({ length: units }, (_, u) => {
    const cx = left + width * u + width / 2
    const unitWall = u % 2 === 0 ? wall : era.colors[(h + 1) % era.colors.length][0]
    return { u, tx: cx - 150 * scale, wall: unitWall }
  })

  // Bush sizes shift a little per home so streets don't look copy-pasted.
  const bushL = 18 + (h % 7)
  const bushR = 14 + ((h >> 3) % 7)

  return (
    <svg
      className="art"
      viewBox="0 0 300 170"
      preserveAspectRatio="xMidYMid slice"
      style={{ height }}
      aria-hidden="true"
    >
      <rect width="300" height="170" fill="var(--sky)" />
      <circle cx={262 - (h % 3) * 24} cy="30" r="12" fill="#fff" opacity=".9" />
      <rect y="150" width="300" height="20" fill="#9cc58f" />
      <rect y="160" width="300" height="10" fill="#c9c4b8" />
      <circle cx="34" cy={154 - bushL} r={bushL} fill="#7fae74" />
      <circle cx="276" cy={154 - bushR} r={bushR} fill="#7fae74" />
      {copies.map(({ u, tx, wall: w }) => (
        <g key={u} transform={`translate(${tx} ${150 * (1 - scale)}) scale(${scale})`}>
          <Shape wall={w} roof={roof} />
        </g>
      ))}
    </svg>
  )
}
