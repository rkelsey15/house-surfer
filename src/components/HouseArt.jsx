import { houseAlt } from '../lib/a11y.js'
import { houseDesign } from '../lib/houseDesign.js'

// House illustrations, drawn in code (no photos, no listing images).
//
// How a home maps to a drawing (the choices live in lib/houseDesign.js):
//   - style (era from year built) -> a shape family (Victorian, Craftsman, cottage,
//                                    ranch, colonial, modern) and a set of palettes
//   - home id                     -> which roof/porch variant, which palette, chimney,
//                                    yard trees, fence, flowers, clouds, mirrored or not
//   - units (1, 2 or 3)           -> one house, or 2 or 3 attached homes
// Same home in, same picture out. It never changes between visits.
//
// Each shape is drawn in a 300 x 170 scene, standing on the ground line y=150,
// roughly between x=50 and x=250. Windows use var(--window), so they glow warm in dark mode.

const WIN = 'var(--window)'

// A window with a frame and cross bars.
const Win = ({ x, y, w, h, t, bars = true }) => (
  <g>
    <rect x={x} y={y} width={w} height={h} fill={WIN} stroke={t} strokeWidth="2" />
    {bars && <path d={`M${x + w / 2} ${y}v${h}M${x} ${y + h / 2}h${w}`} stroke={t} strokeWidth="1.4" />}
  </g>
)

// Shutters either side of a window.
const Shutters = ({ x, y, w, h, c }) => (
  <g fill={c}>
    <rect x={x - 7} y={y} width="6" height={h} rx="1" />
    <rect x={x + w + 1} y={y} width="6" height={h} rx="1" />
  </g>
)

const Chimney = ({ x, y, h = 28, brick }) => (
  <g>
    <rect x={x} y={y} width="12" height={h} fill={brick} />
    <rect x={x - 2} y={y - 3} width="16" height="4" fill={brick} />
  </g>
)

const Knob = ({ x, y }) => <circle cx={x} cy={y} r="1.6" fill="#f4e4b0" />

// ---------------------------------------------------------------------------
// Shapes. Each gets { c: {wall, roof, trim, door}, v: variant, wall (this unit's wall), chimney, brick }.

const SHAPES = {
  // Victorian: tall, gabled, with trim. 0 = turret and porch, 1 = twin gables, 2 = bay window and tall gable.
  victorian: ({ c, v, wall, chimney, brick }) => {
    if (v === 1) {
      return (
        <>
          {chimney && <Chimney x={196} y={34} h={32} brick={brick} />}
          <rect x="84" y="72" width="72" height="78" fill={wall} />
          <polygon points="78,72 120,38 162,72" fill={c.roof} />
          <polygon points="120,48 134,68 106,68" fill={c.trim} opacity=".9" />
          <rect x="150" y="92" width="76" height="58" fill={wall} />
          <polygon points="144,92 188,66 232,92" fill={c.roof} />
          <polygon points="188,74 200,90 176,90" fill={c.trim} opacity=".9" />
          <Win x={98} y={86} w={22} h={26} t={c.trim} />
          <Win x={166} y={104} w={20} h={22} t={c.trim} />
          <rect x="128" y="112" width="22" height="38" fill={c.door} />
          <Knob x={145} y={132} />
          <rect x="196" y="112" width="24" height="38" fill={c.trim} opacity=".25" />
          <path d="M122 100h28M122 104h28" stroke={c.trim} strokeWidth="2" />
          <rect x="82" y="146" width="146" height="4" fill={c.trim} opacity=".6" />
        </>
      )
    }
    if (v === 2) {
      return (
        <>
          {chimney && <Chimney x={176} y={34} h={30} brick={brick} />}
          <rect x="96" y="70" width="108" height="80" fill={wall} />
          <polygon points="150,26 212,70 88,70" fill={c.roof} />
          <polygon points="150,40 168,66 132,66" fill={c.trim} opacity=".9" />
          <circle cx="150" cy="58" r="5" fill={WIN} stroke={c.roof} strokeWidth="1.5" />
          <polygon points="66,92 96,86 96,138 66,142" fill={wall} />
          <polygon points="62,92 82,76 100,88" fill={c.roof} />
          <path d="M66 100l30-6M66 116l30-4M66 130l30-2" stroke={c.trim} strokeWidth="1.5" />
          <Win x={110} y={84} w={22} h={28} t={c.trim} />
          <Win x={168} y={84} w={22} h={28} t={c.trim} />
          <rect x="136" y="112" width="26" height="38" fill={c.door} />
          <Knob x={157} y={132} />
          <Win x={110} y={120} w={22} h={22} t={c.trim} bars={false} />
          <path d="M164 118h28v32h-28z" fill={c.trim} opacity=".35" />
        </>
      )
    }
    return (
      <>
        {chimney && <Chimney x={116} y={36} h={34} brick={brick} />}
        <polygon points="150,42 202,74 98,74" fill={c.roof} />
        <rect x="106" y="74" width="88" height="76" fill={wall} />
        <polygon points="150,52 166,70 134,70" fill={c.trim} opacity=".9" />
        <circle cx="150" cy="64" r="4" fill={WIN} stroke={c.roof} strokeWidth="1.5" />
        <rect x="196" y="58" width="36" height="92" fill={wall} />
        <polygon points="214,20 238,58 190,58" fill={c.roof} />
        <line x1="214" y1="20" x2="214" y2="9" stroke={c.roof} strokeWidth="2" />
        <Win x={204} y={68} w={20} h={24} t={c.trim} />
        <Win x={204} y={104} w={20} h={24} t={c.trim} />
        <Win x={118} y={88} w={24} h={26} t={c.trim} />
        <rect x="156" y="112" width="24" height="38" fill={c.door} />
        <Knob x={175} y={132} />
        <rect x="66" y="98" width="40" height="52" fill={wall} opacity=".9" />
        <polygon points="62,98 86,82 110,98" fill={c.roof} />
        <path d="M70 150V104M82 150V104M94 150V104" stroke={c.trim} strokeWidth="2" />
      </>
    )
  },

  // Craftsman: low gables, deep porches, tapered columns.
  // 0 = porch and gable, 1 = shed dormer, 2 = stone-base columns, 3 = hip roof.
  craftsman: ({ c, v, wall, chimney, brick }) => {
    const stone = '#8d8579'
    if (v === 1) {
      return (
        <>
          {chimney && <Chimney x={196} y={42} h={30} brick={brick} />}
          <polygon points="54,82 150,44 246,82" fill={c.roof} />
          <rect x="128" y="56" width="44" height="24" fill={wall} />
          <polygon points="122,56 150,38 178,56" fill={c.roof} />
          <Win x={138} y={60} w={24} h={16} t={c.trim} />
          <rect x="66" y="82" width="168" height="68" fill={wall} />
          <rect x="66" y="108" width="168" height="6" fill={c.trim} />
          <rect x="74" y="114" width="9" height="36" fill={c.trim} />
          <rect x="217" y="114" width="9" height="36" fill={c.trim} />
          <rect x="138" y="114" width="24" height="36" fill={c.door} />
          <Knob x={157} y={134} />
          <Win x={88} y={90} w={38} h={16} t={c.trim} />
          <Win x={174} y={90} w={38} h={16} t={c.trim} />
        </>
      )
    }
    if (v === 2) {
      return (
        <>
          {chimney && <Chimney x={104} y={40} h={34} brick={brick} />}
          <polygon points="60,82 150,30 240,82" fill={c.roof} />
          <polygon points="150,42 176,76 124,76" fill={c.trim} opacity=".85" />
          <rect x="74" y="82" width="152" height="68" fill={wall} />
          <rect x="74" y="108" width="152" height="8" fill={c.trim} />
          <rect x="82" y="116" width="14" height="34" fill={stone} />
          <rect x="80" y="112" width="18" height="5" fill={c.trim} />
          <rect x="204" y="116" width="14" height="34" fill={stone} />
          <rect x="202" y="112" width="18" height="5" fill={c.trim} />
          <rect x="138" y="116" width="26" height="34" fill={c.door} />
          <Knob x={159} y={134} />
          <Win x={98} y={88} w={34} h={18} t={c.trim} />
          <Win x={170} y={88} w={34} h={18} t={c.trim} />
        </>
      )
    }
    if (v === 3) {
      return (
        <>
          {chimney && <Chimney x={186} y={32} h={30} brick={brick} />}
          <polygon points="44,84 92,46 208,46 256,84" fill={c.roof} />
          <rect x="64" y="84" width="172" height="66" fill={wall} />
          <rect x="64" y="108" width="172" height="6" fill={c.trim} />
          <rect x="72" y="114" width="8" height="36" fill={c.trim} />
          <rect x="220" y="114" width="8" height="36" fill={c.trim} />
          <rect x="138" y="114" width="26" height="36" fill={c.door} />
          <Knob x={159} y={134} />
          <Win x={84} y={90} w={36} h={14} t={c.trim} />
          <Win x={182} y={90} w={36} h={14} t={c.trim} />
          <Win x={132} y={56} w={36} h={20} t={c.trim} />
        </>
      )
    }
    return (
      <>
        {chimney && <Chimney x={196} y={44} h={30} brick={brick} />}
        <polygon points="50,78 150,36 250,78" fill={c.roof} />
        <path d="M110 78l-22 20M190 78l22 20" stroke={c.trim} strokeWidth="2.5" />
        <rect x="64" y="78" width="172" height="72" fill={wall} />
        <rect x="64" y="112" width="172" height="6" fill={c.trim} />
        <rect x="72" y="118" width="8" height="32" fill={c.trim} />
        <rect x="220" y="118" width="8" height="32" fill={c.trim} />
        <rect x="138" y="118" width="26" height="32" fill={c.door} />
        <Knob x={159} y={134} />
        <Win x={92} y={86} w={40} h={20} t={c.trim} />
        <Win x={170} y={86} w={40} h={20} t={c.trim} />
      </>
    )
  },

  // Cottage (pre-war): small and steep. 0 = round attic window, 1 = chimney and arched door, 2 = cross gable.
  cottage: ({ c, v, wall, chimney, brick }) => {
    if (v === 1) {
      return (
        <>
          <Chimney x={190} y={26} h={38} brick={brick} />
          <polygon points="56,74 150,26 244,74" fill={c.roof} />
          <rect x="70" y="74" width="160" height="76" fill={wall} />
          <path d="M136 150v-28a14 14 0 0 1 28 0v28z" fill={c.door} />
          <Knob x={158} y={136} />
          <Win x={86} y={94} w={30} h={24} t={c.trim} />
          <Win x={184} y={94} w={30} h={24} t={c.trim} />
          <Shutters x={86} y={94} w={30} h={24} c={c.door} />
          <Shutters x={184} y={94} w={30} h={24} c={c.door} />
          <rect x="84" y="118" width="34" height="6" fill={c.trim} />
          <rect x="182" y="118" width="34" height="6" fill={c.trim} />
        </>
      )
    }
    if (v === 2) {
      return (
        <>
          {chimney && <Chimney x={196} y={42} h={28} brick={brick} />}
          <polygon points="52,78 150,46 248,78" fill={c.roof} />
          <rect x="66" y="78" width="168" height="72" fill={wall} />
          <polygon points="66,82 108,40 150,82" fill={c.roof} />
          <polygon points="80,80 108,52 136,80" fill={wall} />
          <Win x={98} y={64} w={20} h={14} t={c.trim} />
          <Win x={82} y={96} w={34} h={24} t={c.trim} />
          <rect x="164" y="108" width="26" height="42" fill={c.door} />
          <Knob x={185} y={130} />
          <Win x={204} y={98} w={22} h={22} t={c.trim} />
          <rect x="160" y="104" width="34" height="5" fill={c.trim} />
        </>
      )
    }
    return (
      <>
        {chimney && <Chimney x={92} y={30} h={34} brick={brick} />}
        <polygon points="60,70 150,22 240,70" fill={c.roof} />
        <rect x="74" y="70" width="152" height="80" fill={wall} />
        <rect x="134" y="104" width="30" height="46" fill={c.door} />
        <Knob x={158} y={128} />
        <Win x={90} y={88} w={30} h={24} t={c.trim} />
        <Win x={180} y={88} w={30} h={24} t={c.trim} />
        <circle cx="150" cy="52" r="8" fill={WIN} stroke={c.trim} strokeWidth="2" />
        <rect x="128" y="98" width="42" height="5" fill={c.trim} />
      </>
    )
  },

  // Ranch (mid-century): long and low. 0 = hip roof and garage, 1 = carport, 2 = split level with picture window.
  ranch: ({ c, v, wall, chimney, brick }) => {
    if (v === 1) {
      return (
        <>
          {chimney && <Chimney x={104} y={48} h={26} brick={brick} />}
          <polygon points="44,88 150,64 256,88" fill={c.roof} />
          <rect x="58" y="88" width="184" height="62" fill={wall} />
          <rect x="178" y="100" width="68" height="5" fill={c.trim} />
          <rect x="182" y="105" width="4" height="45" fill={c.trim} />
          <rect x="238" y="105" width="4" height="45" fill={c.trim} />
          <rect x="192" y="132" width="40" height="16" rx="5" fill={c.door} />
          <rect x="198" y="126" width="26" height="10" rx="4" fill={c.door} opacity=".8" />
          <circle cx="200" cy="148" r="3.5" fill="#333" />
          <circle cx="224" cy="148" r="3.5" fill="#333" />
          <rect x="88" y="112" width="20" height="38" fill={c.door} />
          <Knob x={104} y={132} />
          <Win x={120} y={100} w={50} h={18} t={c.trim} />
        </>
      )
    }
    if (v === 2) {
      return (
        <>
          {chimney && <Chimney x={72} y={36} h={30} brick={brick} />}
          <rect x="62" y="66" width="84" height="84" fill={wall} />
          <polygon points="56,66 104,46 152,66" fill={c.roof} />
          <rect x="146" y="98" width="100" height="52" fill={wall} />
          <polygon points="140,98 196,82 252,98" fill={c.roof} />
          <rect x="74" y="94" width="58" height="36" fill={WIN} stroke={c.trim} strokeWidth="2" />
          <path d="M103 94v36M74 112h58" stroke={c.trim} strokeWidth="1.4" />
          <rect x="160" y="112" width="20" height="38" fill={c.door} />
          <Knob x={176} y={132} />
          <Win x={196} y={108} w={36} h={18} t={c.trim} />
          <rect x="62" y="64" width="90" height="4" fill={c.trim} opacity=".7" />
        </>
      )
    }
    return (
      <>
        {chimney && <Chimney x={182} y={40} h={24} brick={brick} />}
        <polygon points="42,82 150,54 258,82" fill={c.roof} />
        <rect x="56" y="82" width="188" height="68" fill={wall} />
        <rect x="76" y="110" width="22" height="40" fill={c.door} />
        <Knob x={94} y={130} />
        <Win x={112} y={96} w={48} h={20} t={c.trim} />
        <rect x="176" y="108" width="56" height="42" fill={c.trim} opacity=".85" />
        <path d="M176 122h56M176 136h56" stroke={c.roof} strokeWidth="1.5" opacity=".6" />
      </>
    )
  },

  // Colonial (late century): two stories, symmetrical, shutters.
  // 0 = classic with two chimneys, 1 = attached garage, 2 = dormers.
  colonial: ({ c, v, wall, chimney, brick }) => {
    const upper = [
      [88, 78],
      [138, 78],
      [188, 78],
    ]
    if (v === 1) {
      return (
        <>
          {chimney && <Chimney x={80} y={34} h={32} brick={brick} />}
          <rect x="70" y="66" width="112" height="84" fill={wall} />
          <polygon points="62,66 126,36 190,66" fill={c.roof} />
          <rect x="182" y="100" width="64" height="50" fill={wall} />
          <polygon points="176,100 214,84 252,100" fill={c.roof} />
          <rect x="192" y="114" width="44" height="36" fill={c.trim} />
          <path d="M192 126h44M192 138h44" stroke={c.roof} strokeWidth="1.2" opacity=".5" />
          {[88, 146].map((x) => (
            <g key={x}>
              <Win x={x} y={76} w={22} h={22} t={c.trim} />
              <Shutters x={x} y={76} w={22} h={22} c={c.door} />
            </g>
          ))}
          <Win x={88} y={110} w={22} h={24} t={c.trim} />
          <Shutters x={88} y={110} w={22} h={24} c={c.door} />
          <rect x="132" y="112" width="24" height="38" fill={c.door} />
          <Knob x={151} y={132} />
          <polygon points="128,110 144,100 160,110" fill={c.trim} />
        </>
      )
    }
    return (
      <>
        {chimney && (
          <>
            <Chimney x={80} y={36} h={32} brick={brick} />
            <Chimney x={208} y={36} h={32} brick={brick} />
          </>
        )}
        <polygon points="56,66 150,34 244,66" fill={c.roof} />
        <rect x="70" y="66" width="160" height="84" fill={wall} />
        {v === 2 &&
          [92, 184].map((x) => (
            <g key={x}>
              <rect x={x} y="48" width="28" height="20" fill={wall} />
              <polygon points={`${x - 4},48 ${x + 14},36 ${x + 32},48`} fill={c.roof} />
              <Win x={x + 6} y={52} w={16} h={12} t={c.trim} bars={false} />
            </g>
          ))}
        {upper.map(([x, y]) => (
          <g key={x}>
            <Win x={x} y={y} w={24} h={22} t={c.trim} />
            <Shutters x={x} y={y} w={24} h={22} c={c.door} />
          </g>
        ))}
        {[88, 188].map((x) => (
          <g key={'l' + x}>
            <Win x={x} y={112} w={24} h={24} t={c.trim} />
            <Shutters x={x} y={112} w={24} h={24} c={c.door} />
          </g>
        ))}
        <rect x="138" y="112" width="24" height="38" fill={c.door} />
        <Knob x={157} y={132} />
        <polygon points="132,110 150,98 168,110" fill={c.trim} />
        <path d="M134 110v40M166 110v40" stroke={c.trim} strokeWidth="1.5" opacity=".6" />
      </>
    )
  },

  // Modern: flat or sloped roofs and big glass. 0 = flat and glass, 1 = butterfly roof, 2 = stacked boxes, 3 = shed roof.
  modern: ({ c, v, wall }) => {
    if (v === 1) {
      return (
        <>
          <rect x="70" y="56" width="160" height="94" fill={wall} />
          <polygon points="58,38 150,62 242,38 242,48 150,72 58,48" fill={c.roof} />
          <rect x="84" y="82" width="42" height="52" fill={WIN} stroke={c.trim} strokeWidth="2" />
          <rect x="132" y="82" width="42" height="52" fill={WIN} stroke={c.trim} strokeWidth="2" />
          <path d="M105 82v52M153 82v52" stroke={c.trim} strokeWidth="1.2" />
          <rect x="186" y="100" width="30" height="50" fill={c.door} />
          <Knob x={211} y={126} />
        </>
      )
    }
    if (v === 2) {
      return (
        <>
          <rect x="60" y="102" width="180" height="48" fill={wall} />
          <rect x="56" y="98" width="188" height="5" fill={c.roof} />
          <rect x="100" y="54" width="132" height="46" fill={wall} opacity=".92" />
          <rect x="94" y="50" width="144" height="5" fill={c.roof} />
          <rect x="112" y="64" width="62" height="28" fill={WIN} stroke={c.trim} strokeWidth="2" />
          <rect x="186" y="64" width="34" height="28" fill={c.roof} opacity=".8" />
          <rect x="74" y="112" width="18" height="38" fill={c.door} />
          <rect x="108" y="114" width="64" height="26" fill={WIN} stroke={c.trim} strokeWidth="2" />
          <path d="M140 114v26" stroke={c.trim} strokeWidth="1.2" />
          <rect x="188" y="116" width="38" height="34" fill={c.roof} opacity=".35" />
        </>
      )
    }
    if (v === 3) {
      return (
        <>
          <polygon points="70,80 230,50 230,150 70,150" fill={wall} />
          <polygon points="62,82 238,48 238,57 62,91" fill={c.roof} />
          <rect x="84" y="112" width="20" height="38" fill={c.door} />
          <Knob x={99} y={132} />
          <rect x="120" y="94" width="44" height="40" fill={WIN} stroke={c.trim} strokeWidth="2" />
          <rect x="174" y="82" width="46" height="52" fill={WIN} stroke={c.trim} strokeWidth="2" />
          <path d="M142 94v40M197 82v52" stroke={c.trim} strokeWidth="1.2" />
        </>
      )
    }
    return (
      <>
        <rect x="70" y="40" width="160" height="110" fill={wall} />
        <rect x="62" y="34" width="176" height="10" fill={c.roof} />
        <rect x="84" y="56" width="70" height="40" fill={WIN} stroke={c.trim} strokeWidth="2" />
        <rect x="170" y="56" width="44" height="94" fill={c.roof} opacity=".8" />
        <rect x="84" y="108" width="70" height="26" fill={WIN} stroke={c.trim} strokeWidth="2" />
        <rect x="180" y="106" width="24" height="44" fill={c.door} />
        <Knob x={199} y={128} />
      </>
    )
  },
}

// ---------------------------------------------------------------------------
// Yard details.

const Tree = ({ kind, x, size }) => {
  if (kind === 'none') return null
  if (kind === 'bush') return <circle cx={x} cy={154 - size} r={size} fill="#7fae74" />
  const trunk = <rect x={x - 2.5} y="118" width="5" height="36" fill="#7a5a44" />
  if (kind === 'round') {
    return (
      <g>
        {trunk}
        <circle cx={x} cy="112" r="22" fill="#6fa56a" />
        <circle cx={x - 7} cy="106" r="9" fill="#86b97d" opacity=".7" />
      </g>
    )
  }
  if (kind === 'pine') {
    return (
      <g>
        <rect x={x - 2.5} y="128" width="5" height="26" fill="#7a5a44" />
        <polygon points={`${x},80 ${x - 17},118 ${x + 17},118`} fill="#4f8a5b" />
        <polygon points={`${x},98 ${x - 21},138 ${x + 21},138`} fill="#5b9a68" />
      </g>
    )
  }
  return (
    <g>
      {trunk}
      <ellipse cx={x} cy="98" rx="14" ry="34" fill="#5f9a62" />
    </g>
  )
}

const Picket = () => (
  <g fill="#fffdf6" opacity=".95">
    <rect x="58" y="142" width="184" height="3" />
    {Array.from({ length: 24 }, (_, i) => 60 + i * 7.6).map((x) =>
      x > 122 && x < 178 ? null : <rect key={x} x={x} y="136" width="4.5" height="16" />,
    )}
  </g>
)

const Flowers = ({ colors }) => (
  <g>
    {[66, 76, 86, 98, 204, 216, 228, 238].map((x, i) => (
      <circle key={x} cx={x} cy={149 + (i % 2)} r="3" fill={colors[i % 2]} />
    ))}
  </g>
)

const Cloud = ({ x, y, s = 1 }) => (
  <g fill="#fff" opacity=".7" transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx="0" cy="0" rx="16" ry="6" />
    <ellipse cx="-8" cy="-5" rx="9" ry="6" />
    <ellipse cx="6" cy="-6" rx="10" ry="7" />
  </g>
)

export default function HouseArt({ home, height = 210 }) {
  const d = houseDesign(home)
  const Shape = SHAPES[d.shape]

  // One house, or 2 or 3 homes side by side, each drawn smaller so they fit.
  // Neighboring units get different wall colors so they read as separate homes.
  const scale = d.units === 1 ? 1 : d.units === 2 ? 0.68 : 0.46
  const width = 200 * scale
  const left = 150 - (width * d.units) / 2
  const copies = Array.from({ length: d.units }, (_, u) => {
    const cx = left + width * u + width / 2
    return { u, tx: cx - 150 * scale, wall: u % 2 === 0 ? d.palette.wall : d.neighborWall }
  })

  return (
    <svg
      className="art"
      viewBox="0 0 300 170"
      preserveAspectRatio="xMidYMid slice"
      style={{ height }}
      role="img"
      aria-label={houseAlt(home)}
    >
      <rect width="300" height="170" fill="var(--sky)" />
      <circle cx={d.sunX} cy="30" r="12" fill="#fff" opacity=".9" />
      {d.cloud >= 1 && <Cloud x={70} y={34} s={1} />}
      {d.cloud === 2 && <Cloud x={176} y={22} s={0.8} />}
      <rect y="150" width="300" height="20" fill="#9cc58f" />
      <rect y="160" width="300" height="10" fill="#c9c4b8" />
      <Tree kind={d.trees.left} x={30} size={d.bushL} />
      <Tree kind={d.trees.right} x={272} size={d.bushR} />
      <g transform={d.flip ? 'translate(300 0) scale(-1 1)' : undefined}>
        {copies.map(({ u, tx, wall }) => (
          <g key={u} transform={`translate(${tx} ${150 * (1 - scale)}) scale(${scale})`}>
            <Shape c={d.palette} v={d.variant} wall={wall} chimney={d.chimney} brick={d.brick} />
          </g>
        ))}
      </g>
      {d.flowers && <Flowers colors={d.flowers} />}
      {d.fence && d.units === 1 && <Picket />}
    </svg>
  )
}
