// House Surfer data pipeline
// ---------------------------------------------------------------------------
// Builds public/data/homes.json: every Queen Anne (Seattle) house, from free
// King County public records.
//
//   Run it with:  npm run data
//   Force fresh downloads:  npm run data -- --refresh
//
// Where the data comes from
//   1. King County Assessor downloads (CSV zips): building facts, land-use
//      code, sale dates. https://info.kingcounty.gov/assessor/DataDownload
//   2. King County GIS "Parcels" layer: the outline of each parcel, which we
//      reduce to one lat/lng point per house.
//   3. Seattle's Neighborhood Map Atlas: the official Queen Anne outline.
//
// Privacy rules baked in (see CLAUDE.md, product rules 1 and 2)
//   - We NEVER read the buyer/seller name columns of the sales file.
//   - Addresses are reduced to the block ("2400 block of Warren Ave N").
//   - Pin locations are fuzzed by about half a block (25-50 m), so a pin can
//     not point at one exact house. The exact location is never saved.
//   - Sale prices are not written out, only the year of the last sale.
//   - The id is a hash, not the county parcel number.

import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { Readable } from 'node:stream'
import { pipeline } from 'node:stream/promises'
import AdmZip from 'adm-zip'
import { parse } from 'csv-parse'

const ROOT = path.resolve(import.meta.dirname, '..')
const RAW = path.join(ROOT, 'data', 'raw')
const ZIPS = path.join(RAW, 'assessor')
const CSVS = path.join(RAW, 'extracted')
const OUT = path.join(ROOT, 'public', 'data', 'homes.json')
const REFRESH = process.argv.includes('--refresh')

const ASSESSOR = 'https://aqua.kingcounty.gov/extranet/assessor/'
const FILES = [
  { zip: 'Residential%20Building.zip', csv: 'EXTR_ResBldg.csv' },
  { zip: 'Parcel.zip', csv: 'EXTR_Parcel.csv' },
  { zip: 'Real%20Property%20Sales.zip', csv: 'EXTR_RPSale.csv' },
]
const KC_PARCELS =
  'https://gismaps.kingcounty.gov/arcgis/rest/services/Property/KingCo_PropertyInfo/MapServer/2/query'
const SEATTLE_HOODS =
  'https://services.arcgis.com/ZOyb2t4B0UYuYNYH/arcgis/rest/services/nma_nhoods_main/FeatureServer/0/query'

// Assessor "PresentUse" codes (from Lookup.zip, LUType 102) that count as houses.
// Condos (20), apartments (11 and others), 4-plexes (5), mobile homes and
// houseboats are deliberately left out.
const HOUSE_USE_CODES = new Set([
  2, // Single Family (residential use/zone)
  6, // Single Family (commercial/industrial zone)
  9, // Single Family (commercial/industrial use)
  272, // Historic property (residence)
  3, // Duplex
  4, // Triplex
  29, // Townhouse plat (allowed by the PRD "if recorded as residential")
])

const log = (...a) => console.log(...a)

// ---------------------------------------------------------------------------
// Step A: download and unpack the Assessor files (cached in data/raw)
// ---------------------------------------------------------------------------

async function download(url, dest) {
  // The county server sometimes cuts long downloads short, so we retry and
  // resume from where we stopped using an HTTP Range request.
  const head = await fetch(url, { method: 'HEAD' })
  const total = Number(head.headers.get('content-length'))
  if (!total) throw new Error(`No size reported for ${url}`)
  for (let attempt = 1; attempt <= 8; attempt++) {
    const have = fs.existsSync(dest) ? fs.statSync(dest).size : 0
    if (have === total) return
    if (have > total) fs.rmSync(dest)
    try {
      const res = await fetch(url, { headers: have ? { Range: `bytes=${have}-` } : {} })
      if (!res.ok && res.status !== 206) throw new Error(`HTTP ${res.status}`)
      const append = res.status === 206
      await pipeline(Readable.fromWeb(res.body), fs.createWriteStream(dest, { flags: append ? 'a' : 'w' }))
    } catch (err) {
      log(`    download interrupted (${err.message}); retrying (${attempt}/8)`)
    }
  }
  if (fs.statSync(dest).size !== total) throw new Error(`Could not finish downloading ${url}`)
}

async function getAssessorFiles() {
  fs.mkdirSync(ZIPS, { recursive: true })
  fs.mkdirSync(CSVS, { recursive: true })
  for (const f of FILES) {
    const zipPath = path.join(ZIPS, decodeURIComponent(f.zip).replace(/ /g, '_'))
    const csvPath = path.join(CSVS, f.csv)
    if (REFRESH && fs.existsSync(zipPath)) fs.rmSync(zipPath)
    if (REFRESH && fs.existsSync(csvPath)) fs.rmSync(csvPath)
    if (!fs.existsSync(csvPath)) {
      log(`  downloading ${decodeURIComponent(f.zip)} ...`)
      await download(ASSESSOR + f.zip, zipPath)
      log(`  unzipping ${f.csv} ...`)
      new AdmZip(zipPath).extractEntryTo(f.csv, CSVS, false, true)
    } else {
      log(`  using cached ${f.csv}`)
    }
  }
}

// Stream a big CSV, keeping only the rows that `keep` says yes to.
async function readCsv(file, keep) {
  const rows = []
  const parser = fs.createReadStream(path.join(CSVS, file)).pipe(
    parse({
      columns: true,
      skip_empty_lines: true,
      relax_column_count: true,
      // Filtering here (while streaming) keeps memory small on the 650 MB sales file.
      on_record: (r) => (keep(r) ? r : null),
    }),
  )
  for await (const r of parser) rows.push(r)
  return rows
}

// ---------------------------------------------------------------------------
// Step B: the Queen Anne outline and parcel outlines (GIS web services)
// ---------------------------------------------------------------------------

async function gisPost(url, params, tries = 5) {
  for (let i = 1; i <= tries; i++) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ f: 'json', ...params }),
      })
      const json = await res.json()
      if (json.error) throw new Error(json.error.message)
      return json
    } catch (err) {
      if (i === tries) throw err
      await new Promise((r) => setTimeout(r, 1500 * i))
    }
  }
}

async function getQueenAnneOutline() {
  const json = await gisPost(SEATTLE_HOODS, {
    where: "L_HOOD='Queen Anne'",
    outFields: 'L_HOOD',
    returnGeometry: 'true',
    outSR: '4326',
  })
  if (json.features.length !== 1) throw new Error(`Expected 1 Queen Anne outline, got ${json.features.length}`)
  return json.features[0].geometry.rings // array of rings of [lng, lat]
}

function bbox(rings) {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
  for (const ring of rings) for (const [x, y] of ring) {
    if (x < minX) minX = x
    if (x > maxX) maxX = x
    if (y < minY) minY = y
    if (y > maxY) maxY = y
  }
  return { minX, minY, maxX, maxY }
}

// Even-odd rule point-in-polygon, so holes in the outline work too.
function inside(x, y, rings) {
  let hit = false
  for (const ring of rings) {
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
      const [xi, yi] = ring[i], [xj, yj] = ring[j]
      if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) hit = !hit
    }
  }
  return hit
}

// Area-weighted centre of the largest ring of a parcel outline.
function centroid(rings) {
  let best = null
  for (const ring of rings) {
    let a = 0, cx = 0, cy = 0
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
      const [x0, y0] = ring[j], [x1, y1] = ring[i]
      const f = x0 * y1 - x1 * y0
      a += f
      cx += (x0 + x1) * f
      cy += (y0 + y1) * f
    }
    if (!best || Math.abs(a) > Math.abs(best.a)) best = { a, cx, cy, ring }
  }
  if (!best || best.a === 0) {
    const [x, y] = rings[0][0]
    return [x, y]
  }
  return [best.cx / (3 * best.a), best.cy / (3 * best.a)]
}

// Move a point 25-50 m (about half a block) in a direction picked from the
// home id, so the result is the same on every run. We retry the direction if
// the first try lands outside the Queen Anne outline (e.g. in the water).
const FUZZ_MIN_M = 25
const FUZZ_MAX_M = 50
function fuzzPoint(lng, lat, id, rings) {
  const M_PER_DEG_LAT = 111320
  for (let attempt = 0; attempt < 12; attempt++) {
    const h = crypto.createHash('sha1').update(`house-surfer:fuzz:${id}:${attempt}`).digest()
    const angle = (h.readUInt16BE(0) / 65536) * 2 * Math.PI
    const meters = FUZZ_MIN_M + (h.readUInt16BE(2) / 65536) * (FUZZ_MAX_M - FUZZ_MIN_M)
    const nLat = lat + (Math.sin(angle) * meters) / M_PER_DEG_LAT
    const nLng = lng + (Math.cos(angle) * meters) / (M_PER_DEG_LAT * Math.cos((lat * Math.PI) / 180))
    if (inside(nLng, nLat, rings)) return [nLng, nLat]
  }
  return null // never expected; caller drops the home rather than keep an exact pin
}

// Download residential parcel outlines inside Queen Anne's bounding box, 1,000 at a time.
async function getParcelCenters(rings) {
  const b = bbox(rings)
  const centers = new Map() // PIN -> [lng, lat]
  let offset = 0
  for (;;) {
    const json = await gisPost(KC_PARCELS, {
      where: "PROPTYPE='R'",
      geometry: `${b.minX},${b.minY},${b.maxX},${b.maxY}`,
      geometryType: 'esriGeometryEnvelope',
      inSR: '4326',
      spatialRel: 'esriSpatialRelIntersects',
      outFields: 'PIN',
      returnGeometry: 'true',
      outSR: '4326',
      geometryPrecision: '6',
      orderByFields: 'OBJECTID',
      resultOffset: String(offset),
      resultRecordCount: '1000',
    })
    for (const feat of json.features) {
      const [x, y] = centroid(feat.geometry.rings)
      if (inside(x, y, rings)) centers.set(feat.attributes.PIN, [x, y])
    }
    offset += json.features.length
    process.stdout.write(`\r  parcels fetched: ${offset}  (inside Queen Anne so far: ${centers.size})   `)
    if (!json.exceededTransferLimit) break
  }
  process.stdout.write('\n')
  return centers
}

// ---------------------------------------------------------------------------
// Step C: turn raw fields into friendly ones
// ---------------------------------------------------------------------------

const num = (v) => Number(String(v ?? '').trim()) || 0
const pinOf = (r) => String(r.Major).trim().padStart(6, '0') + String(r.Minor).trim().padStart(4, '0')

// "94TH" -> "94th", "WARREN" -> "Warren", "MC GRAW" -> "Mc Graw"
function titleCase(s) {
  return s
    .trim()
    .toLowerCase()
    .replace(/\b([a-z])/g, (m) => m.toUpperCase())
    .replace(/\b(\d+)(St|Nd|Rd|Th)\b/g, (_, n, suf) => n + suf.toLowerCase())
}

// Block-level address, e.g. building number 2417 -> "2400 block of Warren Ave N".
function blockAddress(b) {
  const n = parseInt(String(b.BuildingNumber).trim(), 10)
  const street = String(b.StreetName ?? '').trim()
  if (!Number.isFinite(n) || n <= 0 || !street) return null
  const block = Math.floor(n / 100) * 100
  const prefix = String(b.DirectionPrefix ?? '').trim().toUpperCase()
  const type = titleCase(String(b.StreetType ?? ''))
  const suffix = String(b.DirectionSuffix ?? '').trim().toUpperCase()
  const name = [prefix, titleCase(street), type, suffix].filter(Boolean).join(' ')
  // Numbers under 100 would read "0 block of ...", so call that the 0-99 block.
  const label = block === 0 ? '0–99' : String(block)
  return `${label} block of ${name}`
}

// The county data has no architectural style, so "style" is a rough era tag
// based on year built. (Real styles like Craftsman need another data source.)
function styleFromYear(y) {
  if (!y) return 'Unknown era'
  if (y < 1905) return 'Victorian era'
  if (y < 1930) return 'Craftsman era'
  if (y < 1946) return 'Pre-war'
  if (y < 1975) return 'Mid-century'
  if (y < 2000) return 'Late century'
  return 'Modern'
}

function homeType(units, useCode) {
  if (useCode === 29) return 'Townhouse'
  if (units === 2) return 'Duplex'
  if (units === 3) return 'Triplex'
  return 'Single-family'
}

// Counts of what we dropped and why, so the summary can show it.
const dropped = {}
const drop = (why) => (dropped[why] = (dropped[why] ?? 0) + 1)

async function main() {
  log('Step 1/5: county files')
  await getAssessorFiles()

  log('Step 2/5: Queen Anne outline and parcel locations')
  const rings = await getQueenAnneOutline()
  log(`  Queen Anne outline: ${rings.length} ring(s)`)
  const centers = await getParcelCenters(rings)

  log('Step 3/5: parcel land-use codes (what counts as a house)')
  const parcels = await readCsv('EXTR_Parcel.csv', (r) => centers.has(pinOf(r)))
  const useByPin = new Map(parcels.map((p) => [pinOf(p), num(p.PresentUse)]))
  log(`  parcel rows matched: ${parcels.length}`)

  log('Step 4/5: building facts')
  const blds = await readCsv('EXTR_ResBldg.csv', (r) => {
    const pin = pinOf(r)
    return centers.has(pin) && HOUSE_USE_CODES.has(useByPin.get(pin))
  })
  // A parcel can have several buildings (house + backyard cottage, garage...).
  // The biggest building by living area is the main house.
  const mainByPin = new Map()
  for (const b of blds) {
    const pin = pinOf(b)
    const cur = mainByPin.get(pin)
    if (!cur || num(b.SqFtTotLiving) > num(cur.SqFtTotLiving)) mainByPin.set(pin, b)
  }
  log(`  residential buildings: ${blds.length} on ${mainByPin.size} parcels`)

  log('Step 5/5: last sale year (names and prices are never read or saved)')
  const lastSale = new Map()
  const sales = await readCsv('EXTR_RPSale.csv', (r) => mainByPin.has(pinOf(r)) && num(r.SalePrice) > 0)
  for (const s of sales) {
    const pin = pinOf(s)
    const year = Number(String(s.DocumentDate).slice(-4)) // MM/DD/YYYY
    if (year > (lastSale.get(pin) ?? 0)) lastSale.set(pin, year)
  }

  // ---- assemble homes ----
  const homes = []
  const seenIds = new Set()
  for (const [pin, b] of mainByPin) {
    const units = num(b.NbrLivingUnits)
    if (units < 1 || units > 3) { drop('not 1 to 3 units'); continue }
    const address = blockAddress(b)
    if (!address) { drop('no usable address'); continue }
    const sqft = num(b.SqFtTotLiving)
    if (sqft <= 0) { drop('no living area recorded'); continue }
    // Opaque id (not the parcel number) so people can't look up the owner from it.
    const id = crypto.createHash('sha1').update('house-surfer:' + pin).digest('hex').slice(0, 8)
    if (seenIds.has(id)) throw new Error(`id collision on ${id}`)
    seenIds.add(id)
    const [exactLng, exactLat] = centers.get(pin)
    const fuzzed = fuzzPoint(exactLng, exactLat, id, rings)
    if (!fuzzed) { drop('could not fuzz location'); continue }
    const [lng, lat] = fuzzed
    const baths = num(b.BathFullCount) + 0.75 * num(b.Bath3qtrCount) + 0.5 * num(b.BathHalfCount)
    const yearBuilt = num(b.YrBuilt) || null
    homes.push({
      id,
      address,
      lat: Number(lat.toFixed(5)),
      lng: Number(lng.toFixed(5)),
      beds: num(b.Bedrooms) || null,
      baths: baths || null,
      sqft,
      yearBuilt,
      type: homeType(units, useByPin.get(pin)),
      units,
      style: styleFromYear(yearBuilt),
      lastSaleYear: lastSale.get(pin) ?? null,
    })
  }
  homes.sort((a, b) => a.address.localeCompare(b.address, 'en', { numeric: true }) || a.id.localeCompare(b.id))

  fs.mkdirSync(path.dirname(OUT), { recursive: true })
  fs.writeFileSync(OUT, JSON.stringify(homes))

  // ---- summary ----
  const count = (key) => homes.reduce((m, h) => ((m[h[key]] = (m[h[key]] ?? 0) + 1), m), {})
  const pct = (n) => `${Math.round((100 * n) / homes.length)}%`
  log('\nDone.')
  log(`  Homes written: ${homes.length}  ->  ${path.relative(ROOT, OUT)} (${(fs.statSync(OUT).size / 1024).toFixed(0)} KB)`)
  log('  By type: ', count('type'))
  log('  By style:', count('style'))
  log('  Dropped:  ', dropped)
  log(`  Have beds ${pct(homes.filter((h) => h.beds).length)}, baths ${pct(homes.filter((h) => h.baths).length)}, year built ${pct(homes.filter((h) => h.yearBuilt).length)}, last sale ${pct(homes.filter((h) => h.lastSaleYear).length)}`)
}

main().catch((err) => {
  console.error('\nPipeline failed:', err.message)
  process.exit(1)
})
