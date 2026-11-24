import { useLocation } from 'react-router-dom'
import { HouseScene } from '../components/HouseArt.jsx'
import { ERAS, houseDesign } from '../lib/houseDesign.js'

// Not linked anywhere: open #/drawings to see every house shape and roof variant side by side
// (fence on, chimney on). Add ?flip=1 for mirrored, ?units=2 or 3 for attached homes, ?pal=3 for another palette.
export default function DrawingGallery() {
  const q = new URLSearchParams(useLocation().search)
  const flip = q.get('flip') === '1'
  const units = Math.min(Math.max(Number(q.get('units')) || 1, 1), 3)
  const pal = Number(q.get('pal')) || 0
  return (
    <div className="gallery">
      <h1>House drawings</h1>
      <p className="muted">Every shape and variant. Fence and chimney are on so you can check them.</p>
      {Object.entries(ERAS).map(([style, era]) => (
        <section key={style}>
          <h2 className="sec-t">{era.shape} ({style})</h2>
          <div className="gallery-grid">
            {Array.from({ length: era.variants }, (_, v) => {
              const base = houseDesign({ id: 'gallery-' + era.shape + v, style, units })
              const design = { ...base, variant: v, flip, units, fence: true, chimney: true, flowers: null, cloud: 1, trees: { left: 'bush', right: 'round' }, palette: era.palettes[pal % era.palettes.length] }
              return (
                <figure key={v}>
                  <HouseScene design={design} height={200} label={`${era.shape} variant ${v}`} />
                  <figcaption>{era.shape} · variant {v}</figcaption>
                </figure>
              )
            })}
          </div>
        </section>
      ))}
    </div>
  )
}
