import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import L from 'leaflet'
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import HomeCover from '../components/HomeCover.jsx'
import { useGuide } from '../lib/GuideContext.jsx'
import { useHomes } from '../lib/HomesContext.jsx'
import { useRatings } from '../lib/RatingsContext.jsx'
import { pinKind, useHomeStats } from '../lib/homeStats.js'
import { FLAME, CROWN } from '../lib/badges.js'
import { factsLine, ratingText, typeLine } from '../lib/format.js'
import { CheckIcon, CloseIcon } from '../components/Icons.jsx'
import { prefersReducedMotion } from '../lib/a11y.js'
import { DEFAULT_PIN_FILTER, PIN_COLORS, PIN_FILTERS, PIN_FILTER_KEYS, cleanPinFilter, isDefaultPinFilter, passesPinFilter, pinFilterName, pinShape, pinStyle, shapePoints } from '../lib/pins.js'
import { useStoredState } from '../lib/useStoredState.js'

// A pin that can be a circle, square, diamond or star (see lib/pins.js), drawn on
// Leaflet's canvas like the round pins were. Leaflet only draws circles on its
// own, so this takes over the drawing step. Click and tap hit-testing still use
// the circle of the same radius (plus the canvas's tolerance).
//
// WHY it works this way: there are 5,000+ pins. As ordinary HTML markers they would
// make the map slow, so every pin is painted onto one shared canvas instead.
// WATCH OUT: `_updatePath`, `_renderer._ctx`, `_renderer._drawing`, `_fillStroke` and
// `_empty` are Leaflet 1.9 PRIVATE methods, copied from Leaflet's own circle drawing
// (`_updateCircle`). They can change in a Leaflet upgrade, so look at the map (all pin
// shapes, tap a pin, zoom) after upgrading Leaflet.
const ShapeMarker = L.CircleMarker.extend({
  _updatePath() {
    const renderer = this._renderer
    const ctx = renderer._ctx
    if (!ctx || !renderer._drawing || this._empty()) return
    const p = this._point
    const r = Math.max(Math.round(this._radius), 1)
    const shape = this.options.shape
    ctx.beginPath()
    if (shape === 'square' || shape === 'diamond' || shape === 'star') {
      shapePoints(shape, r).forEach(([x, y], i) => (i ? ctx.lineTo(p.x + x, p.y + y) : ctx.moveTo(p.x + x, p.y + y)))
      ctx.closePath()
    } else {
      ctx.arc(p.x, p.y, r, 0, Math.PI * 2)
    }
    renderer._fillStroke(ctx, this)
  },
})

const shapeMarker = (home, kind, radius, extra, big) => {
  const { radius: r, ...style } = pinStyle(kind, radius, big)
  return new ShapeMarker([home.lat, home.lng], { shape: pinShape(kind), radius: r, opacity: 1, ...style, ...extra })
}

// Badges drawn on top of a pin: a small flame for hot homes, a crown for the
// top home of the week. Canvas pins can't hold icons, so these are small
// markers placed over them. Cached per size.
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

// All the pins as one Leaflet layer, redrawn when the homes, ratings or zoom change.
// A wider click tolerance makes the small pins easier to hit (the List view is the
// full alternative for anyone who can't use the map).
// Every marker is rebuilt on each change. That is fast enough for about 5,400 pins and
// keeps this simple; if it ever gets slow, update the markers in place instead.
// `onSelectRef` holds the latest click handler so clicking a pin never uses an old one.
function PinLayer({ homes, stats, radius, onSelect }) {
  const map = useMap()
  const onSelectRef = useRef(onSelect)
  onSelectRef.current = onSelect
  useEffect(() => {
    const renderer = L.canvas({ tolerance: 10 })
    const group = L.layerGroup()
    for (const h of homes) {
      const marker = shapeMarker(h, pinKind(stats.get(h.id)), radius, { renderer })
      marker.on('click', () => onSelectRef.current(h.id))
      group.addLayer(marker)
    }
    group.addTo(map)
    return () => {
      group.remove()
      renderer.remove()
    }
  }, [map, homes, stats, radius])
  return null
}

// The ring that marks the selected home (not clickable).
function SelectedPin({ home, kind, radius }) {
  const map = useMap()
  useEffect(() => {
    if (!home) return undefined
    const marker = shapeMarker(home, kind, radius + 4, { interactive: false }, true).addTo(map)
    return () => marker.remove()
  }, [map, home, kind, radius])
  return null
}

// Pins are small when zoomed out (5,000+ of them) and grow as you zoom in.
const pinRadius = (zoom) => (zoom <= 14 ? 3 : zoom === 15 ? 4 : zoom === 16 ? 6 : 8)

// Moves the map when asked: refresh size after the Map/List switch, fly to a
// home picked from the list, fit the results of a street search.
function MapController({ view, focus, searchHomes, onZoom, reduced }) {
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
    if (focus) map.setView([focus.lat, focus.lng], Math.max(map.getZoom(), 17), { animate: !reduced })
  }, [focus, map])
  useEffect(() => {
    if (searchHomes.length) {
      map.fitBounds(searchHomes.map((h) => [h.lat, h.lng]), { padding: [30, 30], maxZoom: 17, animate: false })
    }
  }, [searchHomes, map])
  return null
}

function ListItem({ home, stat, selected, onShow, source }) {
  return (
    <div className={selected ? 'lcard on' : 'lcard'}>
      <Link to={'/home/' + home.id} state={{ source }} className="lcard-link">
        <div className="lcard-art"><HomeCover home={home} height={72} /></div>
        <div>
          <div className="addr">{home.address}</div>
          <div className="facts">{typeLine(home)}</div>
          <div className="facts">{factsLine(home)}</div>
          <div className="sc">{ratingText(stat)}</div>
        </div>
      </Link>
      <button className="btn quiet lcard-show" onClick={() => onShow(home)}>Show on map</button>
    </div>
  )
}

// One pin drawn small for the legend, from the same shapes the map uses.
function PinIcon({ kind }) {
  const shape = pinShape(kind)
  const c = 9
  const fill = shape === 'circle-hollow' ? 'none' : PIN_COLORS[kind]
  const stroke = shape === 'circle-hollow' ? PIN_COLORS[kind] : 'var(--ink)'
  const common = { fill, stroke, strokeWidth: shape === 'circle-hollow' ? 2 : 1, strokeLinejoin: 'round' }
  return (
    <svg className="legend-pin" viewBox="0 0 18 18" aria-hidden="true">
      {shapePoints(shape, 5.5).length ? (
        <polygon points={shapePoints(shape, 5.5).map(([x, y]) => `${c + x},${c + y}`).join(' ')} {...common} />
      ) : (
        <circle cx={c} cy={c} r={shape === 'circle-hollow' ? 4 : 5.5} {...common} />
      )}
    </svg>
  )
}

// The pin filter: one toggle chip per pin type, drawn with its pin shape, so it doubles as the
// map key. A chip is a button whose name says its state ("Gold homes, shown"). A check mark
// (not only color) shows which are on. The same choice filters the map and the List.
function PinFilter({ on, setOn, shown, total }) {
  const toggle = (key) => setOn((cur) => (cur.includes(key) ? cur.filter((k) => k !== key) : PIN_FILTER_KEYS.filter((k) => k === key || cur.includes(k))))
  return (
    <>
    <div className="chips pinfilter" role="group" aria-label="Pin types to show">
      <span className="muted small chips-count" aria-live="polite">
        Showing {shown.toLocaleString('en-US')} of {total.toLocaleString('en-US')}
      </span>
      <button className="chip" onClick={() => setOn(PIN_FILTER_KEYS)} disabled={on.length === PIN_FILTER_KEYS.length}>All</button>
      <button className="chip" onClick={() => setOn([])} disabled={on.length === 0}>None</button>
      {PIN_FILTERS.map((f) => {
        const isOn = on.includes(f.key)
        return (
          <button key={f.key} className={isOn ? 'chip pin-chip on' : 'chip pin-chip'} aria-label={pinFilterName(f, isOn)} onClick={() => toggle(f.key)}>
            <span className="pin-chip-check" aria-hidden="true">{isOn && <CheckIcon />}</span>
            {f.kind && <PinIcon kind={f.kind} />}
            {f.badge && <i className="legend-badge" aria-hidden="true" dangerouslySetInnerHTML={{ __html: f.badge === 'crown' ? CROWN : FLAME }} />}
            {f.label}
          </button>
        )
      })}
    </div>
    {isDefaultPinFilter(on) && <p className="muted small pinfilter-note">Showing top homes. Tap All to see every house.</p>}
    </>
  )
}

export default function MapScreen() {
  const { markDone } = useGuide()
  useEffect(() => markDone('map'), [markDone])
  const { homes, status, error } = useHomes()
  const stats = useHomeStats(homes)
  const { ratings } = useRatings()
  const [ui, setUi] = useState(() => session.ui)
  // Which pin types are shown (the chips). Remembered across visits.
  const [pinOn, setPinOn] = useStoredState('hs.map_pins', DEFAULT_PIN_FILTER, cleanPinFilter)
  const [focus, setFocus] = useState(null)
  const [zoom, setZoom] = useState(session.map.zoom)
  const [shown, setShown] = useState(LIST_PAGE)
  const reduced = prefersReducedMotion()
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
      if (!passesPinFilter(pinKind(s), s.hot, pinOn, !!ratings[h.id])) return false
      if (ui.filter === 'top') return ['high', 'week'].includes(pinKind(s))
      if (ui.filter === 'unrated') return s.count === 0
      return true
    })
    // Top rated: best first. Otherwise: by street.
    if (ui.filter === 'top') out.sort((a, b) => stats.get(b.id).avg - stats.get(a.id).avg || stats.get(b.id).count - stats.get(a.id).count)
    else out.sort((a, b) => a.address.localeCompare(b.address, 'en', { numeric: true }))
    return out
  }, [homes, stats, ratings, pinOn, ui.query, ui.filter, ui.style])

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

  useEffect(() => setShown(LIST_PAGE), [ui.query, ui.filter, ui.style, pinOn])

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
      <h1 className="sr-only">Map</h1>
      <div className="mapside">
        <div className="maptools">
          <div className="searchrow">
            <input
              className="mapsearch"
              type="search"
              placeholder="Search Queen Anne streets"
              aria-label="Search by street"
              value={ui.query}
              onChange={(e) => patch({ query: e.target.value })}
            />
            <div className="seg viewseg">
              <button className={ui.view === 'map' ? 'on' : ''} aria-pressed={ui.view === 'map'} onClick={() => patch({ view: 'map' })}>Map</button>
              <button className={ui.view === 'list' ? 'on' : ''} aria-pressed={ui.view === 'list'} onClick={() => patch({ view: 'list' })}>List</button>
            </div>
          </div>
          {/* One row on phones that scrolls sideways; wraps on laptops. */}
          <div className="chips" role="group" aria-label="Filters">
            {FILTERS.map(([key, label]) => (
              <button key={key} className={ui.filter === key ? 'chip on' : 'chip'} aria-pressed={ui.filter === key} onClick={() => patch({ filter: key })}>
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
          <PinFilter on={pinOn} setOn={setPinOn} shown={filtered.length} total={homes.length} />
        </div>

        <div className="maplist">
          {filtered.slice(0, shown).map((h) => (
            <ListItem key={h.id} source={ui.query.trim() ? 'search' : 'map'} home={h} stat={stats.get(h.id)} selected={h.id === ui.selected} onShow={showOnMap} />
          ))}
          {filtered.length === 0 && (
            <p className="muted center note">
              {pinOn.length === 0 ? 'No pin types are switched on. Tap All above to show homes again.' : 'No homes match. Try a different street or filter.'}
            </p>
          )}
          {filtered.length > shown && (
            <button className="btn full" onClick={() => setShown((n) => n + LIST_PAGE)}>Show more</button>
          )}
        </div>
      </div>

      <div className="mapwrap" role="region" aria-label="Map of homes. The List view has the same homes.">
        <MapContainer
          center={session.map.center}
          zoom={session.map.zoom}
          minZoom={12}
          maxZoom={19}
          preferCanvas
          zoomAnimation={!reduced}
          fadeAnimation={!reduced}
          markerZoomAnimation={!reduced}
          className="leaflet-host"
        >
          <TileLayer
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            maxNativeZoom={19}
          />
          <MapController view={ui.view} focus={focus} searchHomes={searchHomes} onZoom={setZoom} reduced={reduced} />
          <PinLayer homes={filtered} stats={stats} radius={pinRadius(zoom)} onSelect={select} />
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
          <SelectedPin home={selectedHome} kind={selStat ? pinKind(selStat) : 'unrated'} radius={pinRadius(zoom)} />
        </MapContainer>

        {selectedHome && (
          <div className="mapcard">
            <Link to={'/home/' + selectedHome.id} state={{ source: ui.query.trim() ? 'search' : 'map' }} className="mapcard-link">
              <div className="mapcard-art"><HomeCover home={selectedHome} height={68} /></div>
              <div>
                <div className="addr">{selectedHome.address}</div>
                <div className="facts">{typeLine(selectedHome)}</div>
                <div className="facts">{factsLine(selectedHome)}</div>
                <div className="sc">{ratingText(selStat)}</div>
              </div>
            </Link>
            <button className="icon-btn mapcard-x" aria-label="Close home card" onClick={() => patch({ selected: null })}><CloseIcon /></button>
          </div>
        )}
      </div>
    </div>
  )
}
