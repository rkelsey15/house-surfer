// Which homes show a sample photo (Part F). About 1 in 3, chosen by home id alone, so a
// home shows the same picture on every screen, every visit and every device.
import { SAMPLE_PHOTOS } from './credits.js'

// FNV-1a: a tiny, well-spread hash. Same text in, same number out.
function hash(text) {
  let h = 2166136261
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

// Returns a sample photo for this home, or null (the home keeps its drawing).
// A visitor's own Snap photo and the covers.json photos are checked before this; see PhotosContext.
export function stockPhotoFor(homeId, photos = SAMPLE_PHOTOS) {
  if (!homeId || photos.length === 0) return null
  const h = hash(String(homeId))
  if (h % 3 !== 0) return null
  // Divide by 3 first so the pick isn't tied to the 1-in-3 test above.
  return photos[Math.floor(h / 3) % photos.length]
}

// The whole cover rule in one place. Real photos always win:
//   mine (visitor's Snap photo url) > sample (your own photo from public/images/homes/) > stock > none (drawing)
// Stock photos only go on single-family homes: a one-house photo on a duplex would mislead.
export const isStockEligible = (home) => home?.type === 'Single-family'

export function chooseCover({ homeId, home, mine, sample, base = '/' }) {
  if (mine) return { url: mine, kind: 'yours' }
  if (sample) return { url: sample, kind: 'sample' }
  const stock = isStockEligible(home) ? stockPhotoFor(homeId) : null
  return stock ? { url: `${base}${stock.file}`, kind: 'stock', photo: stock } : null
}
