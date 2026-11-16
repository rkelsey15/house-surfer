import { useMemo, useState } from 'react'
import HouseArt from '../components/HouseArt.jsx'
import { useHomes } from '../lib/HomesContext.jsx'
import { factsLine, typeLine } from '../lib/format.js'

// PLACEHOLDER: the real feed (stars, Skip / Takes / Next) is built in step 3.
// For now it proves the data loads by showing a random home.
export default function Surf() {
  const { homes, status, error } = useHomes()
  const [seed, setSeed] = useState(0)
  const home = useMemo(
    () => (homes.length ? homes[Math.floor(Math.random() * homes.length)] : null),
    [homes, seed], // eslint-disable-line react-hooks/exhaustive-deps
  )

  if (status === 'loading') return <p className="muted center">Loading homes…</p>
  if (status === 'error') return <p className="blocked">Could not load homes: {error}</p>

  return (
    <div>
      <div className="card">
        <HouseArt home={home} />
        <div className="info">
          <div className="addr">{home.address}</div>
          <div className="facts">{typeLine(home)}</div>
          <div className="facts">{factsLine(home)}</div>
        </div>
      </div>
      <p className="muted center note">
        Shell preview: {homes.length.toLocaleString('en-US')} Queen Anne homes loaded. The rating feed comes next.
      </p>
      <button className="btn full" onClick={() => setSeed((s) => s + 1)}>
        Show another home
      </button>
    </div>
  )
}
