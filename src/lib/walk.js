// Walkability: the label and chips shown on the home page.
// The score and counts are built by scripts/walkability.mjs from OpenStreetMap
// and saved in homes.json as `walk` (0 to 100) and `places` (five counts).
// This app never calls it "Walk Score" (that is someone else's trademark).

export function walkLabel(score) {
  if (score >= 90) return "Walker's paradise"
  if (score >= 70) return 'Very walkable'
  if (score >= 50) return 'Somewhat walkable'
  if (score >= 25) return 'Car-dependent'
  return 'Almost all errands need a car'
}

// In the order shown. Skipped when the count is 0.
const CHIPS = [
  ['grocery', 'grocery', 'grocery'],
  ['food', 'cafe or restaurant', 'cafes and restaurants'],
  ['transit', 'transit stop', 'transit stops'],
  ['parks', 'park', 'parks'],
  ['schools', 'school', 'schools'],
]

// Up to 4 chips, like "38 transit stops". Grocery, food, transit and parks win
// over schools when all five are present.
export function walkChips(places = {}, max = 4) {
  return CHIPS.filter(([key]) => places[key] > 0)
    .slice(0, max)
    .map(([key, one, many]) => `${places[key]} ${places[key] === 1 ? one : many}`)
}

// "Very walkable, 86", or null for homes without a score.
export function walkSummary(home) {
  return Number.isFinite(home?.walk) ? `${walkLabel(home.walk)}, ${home.walk}` : null
}

// Steep hill flag: a home has `hill: true` when the ground slopes 18% or more
// around it (see scripts/elevation.mjs). Flat homes simply have no `hill` field.
export const hillNote = (home) => (home?.hill ? 'Steep hill' : null)
