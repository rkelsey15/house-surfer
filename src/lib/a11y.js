// Text for screen readers, kept in one place so it can be tested.

// "Rate 4 of 5 stars" for each star button.
export const starLabel = (n) => `Rate ${n} of 5 stars`

// Spoken after you pick a rating.
export const ratedText = (n) => `You rated this ${n} of 5`

const ERA_WORDS = {
  'Victorian era': 'Victorian-era',
  'Craftsman era': 'Craftsman-era',
  'Pre-war': 'pre-war',
  'Mid-century': 'mid-century',
  'Late century': 'late-century',
  Modern: 'modern',
}
const TYPE_WORDS = { 'Single-family': 'house', Duplex: 'duplex', Triplex: 'triplex', Townhouse: 'townhouse' }

// One line describing a house drawing, built from the data only:
// "Illustration, not this home: a Craftsman-era duplex, built 1924". Matches the chip on the drawing.
export function houseAlt(home) {
  const era = ERA_WORDS[home.style] ?? ''
  const type = TYPE_WORDS[home.type] ?? 'house'
  const built = home.yearBuilt ? `, built ${home.yearBuilt}` : ''
  return `Illustration, not this home: a ${era ? era + ' ' : ''}${type}${built}`
}

// True when the device asks for less motion (WCAG 2.3.3). Safe outside a browser.
export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
