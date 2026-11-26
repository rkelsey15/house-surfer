// "Steep hill" flag from free elevation tiles (AWS Terrain Tiles, Terrarium
// format; built from USGS 3DEP and other public data). No key, no account.
//
// We download the few 256 px tiles that cover Queen Anne (saved in
// data/raw/elevation), read the height at points around each home, and work
// out the slope. Only a yes/no flag is saved in homes.json: never a height
// and never a coordinate. The exact point stays in memory.

import fs from 'node:fs'
import path from 'node:path'
import zlib from 'node:zlib'

const Z = 14
const TILE = 256
const SAMPLE_M = 50 // look this far each way (north, south, east, west)
export const STEEP_GRADE = 0.18 // 18 percent: 18 m of rise over 100 m (about 1 home in 4 here)
const M_PER_DEG_LAT = 111320

// Minimal PNG reader for the 8-bit RGB, non-interlaced tiles this service sends.
export function decodePng(buf) {
  let pos = 8, width, height, bpp
  const idat = []
  while (pos < buf.length) {
    const len = buf.readUInt32BE(pos), type = buf.toString('ascii', pos + 4, pos + 8)
    const data = buf.subarray(pos + 8, pos + 8 + len)
    if (type === 'IHDR') {
      width = data.readUInt32BE(0); height = data.readUInt32BE(4)
      if (data[8] !== 8 || data[12] !== 0 || (data[9] !== 2 && data[9] !== 6)) throw new Error('Unexpected PNG type')
      bpp = data[9] === 2 ? 3 : 4
    } else if (type === 'IDAT') idat.push(data)
    pos += 12 + len
  }
  const raw = zlib.inflateSync(Buffer.concat(idat))
  const stride = width * bpp
  const out = Buffer.alloc(height * stride)
  for (let y = 0; y < height; y++) {
    const f = raw[y * (stride + 1)], row = y * (stride + 1) + 1
    for (let x = 0; x < stride; x++) {
      const cur = raw[row + x]
      const a = x >= bpp ? out[y * stride + x - bpp] : 0
      const b = y > 0 ? out[(y - 1) * stride + x] : 0
      const c = x >= bpp && y > 0 ? out[(y - 1) * stride + x - bpp] : 0
      let v
      if (f === 0) v = cur
      else if (f === 1) v = cur + a
      else if (f === 2) v = cur + b
      else if (f === 3) v = cur + ((a + b) >> 1)
      else {
        const p = a + b - c, pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c)
        v = cur + (pa <= pb && pa <= pc ? a : pb <= pc ? b : c)
      }
      out[y * stride + x] = v & 255
    }
  }
  return { width, height, bpp, data: out }
}

const worldPx = (lng, lat) => {
  const n = 2 ** Z * TILE
  const s = Math.sin((lat * Math.PI) / 180)
  return [((lng + 180) / 360) * n, (0.5 - Math.log((1 + s) / (1 - s)) / (4 * Math.PI)) * n]
}

export async function loadElevation(bounds, rawDir, refresh, log = console.log) {
  const dir = path.join(rawDir, 'elevation')
  fs.mkdirSync(dir, { recursive: true })
  const [x0, y0] = worldPx(bounds.minX - 0.002, bounds.maxY + 0.002)
  const [x1, y1] = worldPx(bounds.maxX + 0.002, bounds.minY - 0.002)
  const tiles = new Map()
  for (let tx = Math.floor(x0 / TILE); tx <= Math.floor(x1 / TILE); tx++) {
    for (let ty = Math.floor(y0 / TILE); ty <= Math.floor(y1 / TILE); ty++) {
      const file = path.join(dir, `${Z}-${tx}-${ty}.png`)
      if (refresh || !fs.existsSync(file)) {
        log(`  downloading elevation tile ${tx},${ty} ...`)
        const res = await fetch(`https://s3.amazonaws.com/elevation-tiles-prod/terrarium/${Z}/${tx}/${ty}.png`)
        if (!res.ok) throw new Error(`Elevation tile ${tx},${ty}: HTTP ${res.status}`)
        fs.writeFileSync(file, Buffer.from(await res.arrayBuffer()))
        await new Promise((r) => setTimeout(r, 300)) // be polite
      }
      tiles.set(`${tx},${ty}`, decodePng(fs.readFileSync(file)))
    }
  }
  log(`  elevation tiles: ${tiles.size}`)
  const px = (X, Y) => {
    const t = tiles.get(`${Math.floor(X / TILE)},${Math.floor(Y / TILE)}`)
    if (!t) return null
    const i = ((Y % TILE) * TILE + (X % TILE)) * t.bpp
    return t.data[i] * 256 + t.data[i + 1] + t.data[i + 2] / 256 - 32768
  }
  // Height in metres at a point (nearest pixel is fine at about 3 m per pixel).
  return (lng, lat) => {
    const [X, Y] = worldPx(lng, lat)
    return px(Math.floor(X), Math.floor(Y))
  }
}

// Slope (rise over run) around a point, from four samples SAMPLE_M away.
export function gradeAt(heightAt, lng, lat) {
  const dLat = SAMPLE_M / M_PER_DEG_LAT
  const dLng = SAMPLE_M / (M_PER_DEG_LAT * Math.cos((lat * Math.PI) / 180))
  const n = heightAt(lng, lat + dLat), s = heightAt(lng, lat - dLat)
  const e = heightAt(lng + dLng, lat), w = heightAt(lng - dLng, lat)
  if ([n, s, e, w].some((v) => v == null)) return null
  return Math.hypot((n - s) / (2 * SAMPLE_M), (e - w) / (2 * SAMPLE_M))
}
