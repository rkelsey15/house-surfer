import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import L from 'leaflet'
import { CircleMarker, MapContainer, Marker, TileLayer, useMap, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import HomeCover from '../components/HomeCover.jsx'
import { useGuide } from '../lib/GuideContext.jsx'
import { useHomes } from '../lib/HomesContext.jsx'
import { pinKind, useHomeStats } from '../lib/homeStats.js'
import { factsLine, typeLine } from '../lib/format.js'

// Pin colors. Fixed hex values so they read on both the light and dark map.
// gray = unrated, slate blue = under 3.5, green = 3.5 to 4.4,
// gold = 4.5+ with 3+ ratings, purple = top home of the week.
const PIN_COLORS = { unrated: '#8a9591', low: '#2f7fd0', mid: '#2e9e6b', high: '#f2c200', week: '#8e5bd0' }

// How each kind of pin is drawn:
//   unrated = small hollow gray circle (outline only)
//   gold    = true yellow-gold with a dark outline so it can't pass for orange
//   others  = solid color with a white outline
function pinStyle(kind, radius, big = false) {
  const ring = big ? 1.5 : 1
  if (kind === 'unrated') {
    return { radius: Math.max(2, Math.round(radius * 0.75)), pathOptions: { color: PIN_COLORS.unrated, weight: radius > 5 ? 2 : 1.5, fill: false, opacity: 1 } }
  }
  if (kind === 'high') {
    return { radius, pathOptions: { color: '#4a3b00', weight: ring * 1.5, fillColor: PIN_COLORS.high, fillOpacity: 1 } }
  }
  return { radius, pathOptions: { color: '#ffffff', weight: radius > 5 ? 2 * ring : ring, fillColor: PIN_COLORS[kind], fillOpacity: 0.95 } }
}

// Badges drawn on top of a pin: a small flame for hot homes, a crown for the
// top home of the week. Canvas pins can't hold icons, so these are small
// markers placed over them. Cached per size.
const FLAME = '<svg viewBox="0 0 24 24"><path d="M12 2c1 3.5 5 5.5 5 11a5 5 0 0 1-10 0c0-2 1-3.4 2-4.4.2 1.4.8 2.2 1.6 2.6C10 8 10.4 5 12 2z" fill="#ff6a2b" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/></svg>'
const CROWN = '<svg viewBox="0 0 24 24"><path d="M3 18 2 7l5.5 4.5L12 4l4.5 7.5L22 7l-1 11z" fill="#f5c518" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/></svg>'
const iconCache = new Map()
function badgeIcon(kind, size) {
  const key = kind + size
  if (!iconCache.has(key)) {
    iconCache.set(key, L.divIcon({
      className: 'badge-icon',
      html: kind === 'crown' ? CROWN : FLAME,
      iconSize: [size, size],
      iconAnchor: [size / 2, size + 1],
    }))
  }
  return iconCache.get(key)
}

const STYLES = ['Victorian era', 'Craftsman era', 'Pre-war', 'Mid-century', 'Late century', 'Modern']
const FILTERS = [
  ['all', 'All homes'],
  ['top', 'Top rated'],
  ['unrated', 'Unrated'],
]
const QUEEN_ANNE = [47.6375, -122.3575]
const LIST_PAGE = 60

// Remembered while the app is open, so Back from a home page returns to the
// same search, filters and map position.
const session = {
  ui: { query: '', filter: 'all', style: 'all', view: 'map', selected: null },
  map: { center: QUEEN_ANNE, zoom: 15 },
}

const ratingText = (stat) => (stat.count ? `★ ${stat.avg.toFixed(1)} · ${stat.count} rating${stat.count === 1 ? '' : 's'}` : 'Not rated yet · be first')

// One pin. Memoized so changing the selection redraws only what changed.
const Pin = memo(function Pin({ home, kind, radius, onSelect }) {
  const style = pinStyle(kind, radius)
  return (
    <CircleMarker
      center={[home.lat, home.lng]}
      radius={style.radius}
      pathOptions={style.pathOptions}
      eventHandlers={{ click: () => onSelect(home.id) }}
    />
  )
})

// Pins are small when zoomed out (5,000+ of them) and grow as you zoom in.
const pinRadius = (zoom) => (zoom <= 14 ? 3 : zoom === 15 ? 4 : zoom === 16 ? 6 : 8)

// Moves the map when asked: refresh size after the Map/List switch, fly to a
// home picked from the list, fit the results of a street search.
function MapController({ view, focus, searchHomes, onZoom }) {
  const map = useMap()
  useMapEvents({
    zoomend: () => onZoom(map.getZoom()),
    moveend: () => {
      const c = map.getCenter()
      session.map = { center: [c.lat, c.lng], zoom: map.getZoom() }
    },
  })
  useEffect(() => {
    map.invalidateSize()
  }, [view, map])
  useEffect(() => {
    if (focus) map.setView([focus.lat, focus.lng], Math.max(map.getZoom(), 17))
  }, [focus, map])
  useEffect(() => {
    if (searchHomes.length) {
      map.fitBounds(searchHomes.map((h) => [h.lat, h.lng]), { padding: [30, 30], maxZoom: 17, animate: false })
    }
  }, [searchHomes, map])
  return null
}

function ListItem({ home, stat, selected, onShow }) {
  return (
    <div className={selected ? 'lcard on' : 'lcard'}>
      <Link to={'/home/' + home.id} className="lcard-link">
        <div className="lcard-art"><HomeCover home={home} height={72} /></div>
        <div>
          <div className="addr">{home.address}</div>
          <div className="facts">{typeLine(home)}</div>
          <div className="facts">{factsLine(home)}</div>
          <div className="sc">{ratingText(stat)}</div>
        </div>
      </Link>
      <button className="link-btn lcard-show" onClick={() => onShow(home)}>Show on map</button>
    </div>
  )
}

export default function MapScreen() {
  const { markDone } = useGuide()
  useEffect(() => markDone('map'), [markDone])
  const { homes, status, error } = useHomes()
  const stats = useHomeStats(homes)
  const [ui, setUi] = useState(() => session.ui)
  const [focus, setFocus] = useState(null)
  const [zoom, setZoom] = useState(session.map.zoom)
  const [shown, setShown] = useState(LIST_PAGE)
  const patch = (p) => setUi((u) => ({ ...u, ...p }))
  useEffect(() => {
    session.ui = ui
  }, [ui])

  // Homes that pass the search and filters. Drives both the pins and the list.
  const filtered = useMemo(() => {
    const q = ui.query.trim().toLowerCase()
    const out = homes.filter((h) => {
      const s = stats.get(h.id)
      if (!s) return false
      if (q && !h.address.toLowerCase().includes(q)) return false
      if (ui.style !== 'all' && h.style !== ui.style) return false
      if (ui.filter === 'top') return ['high', 'week'].includes(pinKind(s))
      if (ui.filter === 'unrated') return s.count === 0
      return true
    })
    // Top rated: best first. Otherwise: by street.
    if (ui.filter === 'top') out.sort((a, b) => stats.get(b.id).avg - stats.get(a.id).avg || stats.get(b.id).count - stats.get(a.id).count)
    else out.sort((a, b) => a.address.localeCompare(b.address, 'en', { numeric: true }))
    return out
  }, [homes, stats, ui.query, ui.filter, ui.style])

  // The map re-fits only when the search text changes, not on every rating.
  const filteredRef = useRef(filtered)
  filteredRef.current = filtered
  // Wait until typing pauses, then fit once. (Leaflet drops overlapping zoom
  // animations, so fitting on every keystroke can leave the map in the wrong place.)
  // Coming back from a home page does not re-fit: the saved position wins.
  const [fitQuery, setFitQuery] = useState('')
  const lastFit = useRef(ui.query)
  useEffect(() => {
    const t = setTimeout(() => {
      if (ui.query !== lastFit.current) {
        lastFit.current = ui.query
        setFitQuery(ui.query)
      }
    }, 350)
    return () => clearTimeout(t)
  }, [ui.query])
  const searchHomes = useMemo(
    () => (fitQuery.trim() ? filteredRef.current.slice(0, 500) : []),
    [fitQuery, homes], // eslint-disable-line react-hooks/exhaustive-deps
  )

  useEffect(() => setShown(LIST_PAGE), [ui.query, ui.filter, ui.style])

  const select = useCallback((id) => setUi((u) => ({ ...u, selected: id })), [])
  const selectedHome = ui.selected ? homes.find((h) => h.id === ui.selected) : null
  const showOnMap = (home) => {
    setUi((u) => ({ ...u, selected: home.id, view: 'map' }))
    setFocus({ lat: home.lat, lng: home.lng, n: Date.now() })
  }

  if (status === 'loading') return <p className="muted center">Loading homes…</p>
  if (status === 'error') return <p className="blocked">Could not load homes: {error}</p>

  const selStat = selectedHome && stats.get(selectedHome.id)

  return (
    <div className={`mapscreen view-${ui.view}`}>
      <div className="mapside">
        <div className="maptools">
          <input
            className="mapsearch"
            type="search"
            placeholder="Search Queen Anne streets"
            aria-label="Search by street"
            value={ui.query}
            onChange={(e) => patch({ query: e.target.value })}
          />
          <div className="chips">
            {FILTERS.map(([key, label]) => (
              <button key={key} className={ui.filter === key ? 'chip on' : 'chip'} onClick={() => patch({ filter: key })}>
                {label}
              </button>
            ))}
            <select className="chip" aria-label="Style" value={ui.style} onChange={(e) => patch({ style: e.target.value })}>
              <option value="all">Any style</option>
              {STYLES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="maptools-row">
            <span className="muted small">{filtered.length.toLocaleString('en-US')} home{filtered.length === 1 ? '' : 's'}</span>
            <div className="seg viewseg">
              <button className={ui.view === 'map' ? 'on' : ''} onClick={() => patch({ view: 'map' })}>Map</button>
              <button className={ui.view === 'list' ? 'on' : ''} onClick={() => patch({ view: 'list' })}>List</button>
            </div>
          </div>
        </div>

        <div className="maplist">
          {filtered.slice(0, shown).map((h) => (
            <ListItem key={h.id} home={h} stat={stats.get(h.id)} selected={h.id === ui.selected} onShow={showOnMap} />
          ))}
          {filtered.length === 0 && <p className="muted center note">No homes match. Try a different street or filter.</p>}
          {filtered.length > shown && (
            <button className="btn full" onClick={() => setShown((n) => n + LIST_PAGE)}>Show more</button>
          )}
        </div>
      </div>

      <div className="mapwrap">
        <MapContainer
          center={session.map.center}
          zoom={session.map.zoom}
          minZoom={12}
          maxZoom={19}
          preferCanvas
          className="leaflet-host"
        >
          <TileLayer
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            maxNativeZoom={19}
          />
          <MapController view={ui.view} focus={focus} searchHomes={searchHomes} onZoom={setZoom} />
          {filtered.map((h) => (
            <Pin key={h.id} home={h} kind={pinKind(stats.get(h.id))} radius={pinRadius(zoom)} onSelect={select} />
          ))}
          {zoom >= 15 &&
            filtered.map((h) => {
              const s = stats.get(h.id)
              if (!s.hot && !s.week) return null
              const size = s.week ? 26 : zoom >= 17 ? 18 : 14
              return (
                <Marker
                  key={'b' + h.id}
                  position={[h.lat, h.lng]}
                  icon={badgeIcon(s.week ? 'crown' : 'flame', size)}
                  interactive={false}
                  keyboard={false}
                />
              )
            })}
          {selectedHome && (
            <CircleMarker
              center={[selectedHome.lat, selectedHome.lng]}
              interactive={false}
              {...pinStyle(pinKind(selStat), pinRadius(zoom) + 4, true)}
            />
          )}
        </MapContainer>

        <div className="legend">
          <span><i className="dot hollow" style={{ borderColor: PIN_COLORS.unrated }} />Unrated</span>
          <span><i className="dot" style={{ background: PIN_COLORS.low }} />Under 3.5</span>
          <span><i className="dot" style={{ background: PIN_COLORS.mid }} />3.5 to 4.4</span>
          <span><i className="dot ringed" style={{ background: PIN_COLORS.high }} />4.5+ (3+ ratings)</span>
          <span><i className="legend-badge" dangerouslySetInnerHTML={{ __html: FLAME }} />Hot this week</span>
          <span><i className="legend-badge" dangerouslySetInnerHTML={{ __html: CROWN }} />Top of the week</span>
        </div>

        {selectedHome && (
          <div className="mapcard">
            <Link to={'/home/' + selectedHome.id} className="mapcard-link">
              <div className="mapcard-art"><HomeCover home={selectedHome} height={68} /></div>
              <div>
                <div className="addr">{selectedHome.address}</div>
                <div className="facts">{typeLine(selectedHome)}</div>
                <div className="facts">{factsLine(selectedHome)}</div>
                <div className="sc">{ratingText(selStat)}</div>
              </div>
            </Link>
            <button className="mapcard-x" aria-label="Close" onClick={() => patch({ selected: null })}>×</button>
          </div>
        )}
      </div>
    </div>
  )
}
