// Picking the house for a photo: nearest homes to the visitor, or address search.
// The visitor's position is only used to sort this list. It is never saved or
// logged, and the pins themselves are already blurred 25 to 50 m (see PRD).

const METERS_PER_DEGREE = 111_320

// Distance in meters (flat-earth estimate; fine over a few kilometers).
export function metersBetween(lat1, lng1, lat2, lng2) {
  const dy = (lat2 - lat1) * METERS_PER_DEGREE
  const dx = (lng2 - lng1) * METERS_PER_DEGREE * Math.cos(((lat1 + lat2) / 2) * (Math.PI / 180))
  return Math.hypot(dx, dy)
}

// The `count` homes closest to a point, nearest first: [{ home, meters }].
export function nearestHomes(homes, lat, lng, count = 5) {
  return homes
    .map((home) => ({ home, meters: metersBetween(lat, lng, home.lat, home.lng) }))
    .sort((a, b) => a.meters - b.meters)
    .slice(0, count)
}

// Homes whose block address contains every word typed, in street order.
export function searchHomes(homes, query, limit = 8) {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean)
  if (!words.length) return []
  const out = []
  for (const home of homes) {
    const address = home.address.toLowerCase()
    if (words.every((w) => address.includes(w))) out.push(home)
  }
  out.sort((a, b) => a.address.localeCompare(b.address, 'en', { numeric: true }))
  return out.slice(0, limit)
}
