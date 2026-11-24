// Sample cover photos: photos you add yourself to public/images/homes/ and list in
// public/images/homes/covers.json, like this:
//
//   { "055c5ad4": { "file": "055c5ad4.jpg" }, "1a2b3c4d": { "file": "porch.jpg" } }
//
// The keys are home ids (from public/data/homes.json). A home with a sample cover shows
// that photo instead of the drawing, until a visitor snaps their own photo of it.
// Stock photos never go here (CLAUDE.md rule 4): only photos you took from a public sidewalk.

const OK_FILE = /^[\w.-]+\.(jpe?g|png|webp)$/i

// Turns the covers.json contents into a Map of homeId -> url. Anything that doesn't look
// right (a path with slashes, a non-image file, a missing name) is skipped, not trusted.
export function parseCovers(json, base = '/') {
  const out = new Map()
  if (!json || typeof json !== 'object' || Array.isArray(json)) return out
  for (const [homeId, entry] of Object.entries(json)) {
    const file = entry?.file
    if (typeof file !== 'string' || !OK_FILE.test(file) || file.includes('..')) continue
    out.set(homeId, `${base}images/homes/${file}`)
  }
  return out
}
