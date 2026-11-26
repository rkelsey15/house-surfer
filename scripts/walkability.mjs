// Walkability: counts of everyday places within about 800 m of each home,
// from OpenStreetMap (free, © OpenStreetMap contributors, ODbL).
//
// Pure helpers live here so tests can import them. The pipeline
// (build-homes.mjs) calls getPlaces() once, then countsFor() and walkScore()
// for each home. Place coordinates are never written to homes.json: only the
// five counts and the 0 to 100 score are saved. See docs/DECISIONS.md.

import fs from 'node:fs'
import path from 'node:path'

export const RADIUS_M = 800

// Each category: how many places earn full marks (cap) and how much of the
// 100 points it is worth (weight). Weights add to 100.
export const CATEGORIES = [
  { key: 'grocery', label: 'grocery', cap: 5, weight: 30 },
  { key: 'food', label: 'cafes and restaurants', cap: 40, weight: 25 },
  { key: 'transit', label: 'transit stops', cap: 40, weight: 20 },
  { key: 'parks', label: 'parks', cap: 8, weight: 15 },
  { key: 'schools', label: 'schools', cap: 4, weight: 10 },
]

// Which OSM tags make a place count, and for which category.
export function categoryOf(tags = {}) {
  if (['supermarket', 'convenience', 'greengrocer'].includes(tags.shop)) return 'grocery'
  if (['cafe', 'restaurant'].includes(tags.amenity)) return 'food'
  if (tags.leisure === 'park') return 'parks'
  if (tags.amenity === 'school') return 'schools'
  if (tags.highway === 'bus_stop' || ['tram_stop', 'station', 'halt'].includes(tags.railway)) return 'transit'
  return null
}

// 0 to 100: each category scores count / cap (at most 1), times its weight.
export function walkScore(counts) {
  let total = 0
  for (const c of CATEGORIES) total += Math.min((counts[c.key] ?? 0) / c.cap, 1) * c.weight
  return Math.round(total)
}


const M_PER_DEG_LAT = 111320

// A coarse grid (cells about RADIUS_M wide) so each home only checks nearby places.
export function makeIndex(places, lat0) {
  const mLng = M_PER_DEG_LAT * Math.cos((lat0 * Math.PI) / 180)
  const cell = RADIUS_M
  const grid = new Map()
  const toXY = (lng, lat) => [lng * mLng, lat * M_PER_DEG_LAT]
  for (const p of places) {
    const [x, y] = toXY(p.lng, p.lat)
    const k = `${Math.floor(x / cell)},${Math.floor(y / cell)}`
    if (!grid.has(k)) grid.set(k, [])
    grid.get(k).push({ x, y, cat: p.cat })
  }
  return { grid, cell, toXY }
}

export function countsFor(index, lng, lat) {
  const { grid, cell, toXY } = index
  const [x, y] = toXY(lng, lat)
  const cx = Math.floor(x / cell), cy = Math.floor(y / cell)
  const counts = Object.fromEntries(CATEGORIES.map((c) => [c.key, 0]))
  for (let i = cx - 1; i <= cx + 1; i++) {
    for (let j = cy - 1; j <= cy + 1; j++) {
      for (const p of grid.get(`${i},${j}`) ?? []) {
        if (Math.hypot(p.x - x, p.y - y) <= RADIUS_M) counts[p.cat]++
      }
    }
  }
  return counts
}

const OVERPASS = ['https://overpass-api.de/api/interpreter', 'https://overpass.kumi.systems/api/interpreter']

function query(b) {
  const box = `${b.minY},${b.minX},${b.maxY},${b.maxX}`
  return `[out:json][timeout:90];
(
  nwr["shop"~"^(supermarket|convenience|greengrocer)$"](${box});
  nwr["amenity"~"^(cafe|restaurant|school)$"](${box});
  nwr["leisure"="park"](${box});
  nwr["highway"="bus_stop"](${box});
  nwr["railway"~"^(tram_stop|station|halt)$"](${box});
);
out center tags;`
}

// One request for the whole box (Queen Anne plus a margin), saved to data/raw.
// Reused on later runs; pass refresh = true to download again.
export async function getPlaces(bounds, rawDir, refresh, log = console.log) {
  const file = path.join(rawDir, 'osm-places.json')
  let json
  if (!refresh && fs.existsSync(file)) {
    log('  using saved OpenStreetMap file (run with --refresh to download again)')
    json = JSON.parse(fs.readFileSync(file, 'utf8'))
  } else {
    const pad = 0.0125 // about 1.4 km in latitude: covers 800 m past the edge
    const b = { minX: bounds.minX - pad * 1.5, maxX: bounds.maxX + pad * 1.5, minY: bounds.minY - pad, maxY: bounds.maxY + pad }
    let lastErr
    for (let attempt = 0; attempt < 6 && !json; attempt++) {
      const url = OVERPASS[attempt % OVERPASS.length]
      try {
        log(`  asking Overpass (${new URL(url).host}) for places...`)
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'content-type': 'application/x-www-form-urlencoded', 'user-agent': 'house-surfer-data-build/1.0 (portfolio demo)' },
          body: new URLSearchParams({ data: query(b) }),
        })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        json = await res.json()
      } catch (err) {
        lastErr = err
        const wait = 10000 * (attempt + 1)
        log(`    Overpass said: ${err.message}; waiting ${wait / 1000}s`)
        await new Promise((r) => setTimeout(r, wait))
      }
    }
    if (!json) throw new Error(`Overpass failed: ${lastErr?.message}`)
    // Keep only the category and position: no names, no other tags.
    json = { elements: json.elements.map((e) => ({ tags: e.tags, lat: e.lat ?? e.center?.lat, lon: e.lon ?? e.center?.lon })) }
    fs.mkdirSync(rawDir, { recursive: true })
    fs.writeFileSync(file, JSON.stringify(json))
  }
  const places = []
  for (const e of json.elements) {
    const cat = categoryOf(e.tags)
    if (cat && e.lat != null) places.push({ lat: e.lat, lng: e.lon, cat })
  }
  return places
}
